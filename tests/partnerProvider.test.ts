import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AuthorizedPartnerProvider,
  UpstreamMatchPayload,
} from '../src/services/provider/partnerProvider';
import { ProviderConfigurationError } from '../src/services/provider/factory';

describe('AuthorizedPartnerProvider', () => {
  const dummyApiKey = 'test_partner_api_key_secure_123';
  const dummyBaseUrl = 'https://api.test-cricket.com/v1';

  // 1. Authentication Configuration
  it('throws ProviderConfigurationError when initialized without an API key', () => {
    assert.throws(
      () => {
        new AuthorizedPartnerProvider({ apiKey: '' });
      },
      (err: unknown) => {
        assert.equal(err instanceof ProviderConfigurationError, true);
        assert.match(
          (err as Error).message,
          /CRICLIVE_PARTNER_API_KEY is required to initialize AuthorizedPartnerProvider/
        );
        return true;
      }
    );
  });

  it('transmits API key in server-side x-api-key request header', async () => {
    let capturedHeaders: HeadersInit | undefined;

    const mockFetch: typeof fetch = async (url, init) => {
      capturedHeaders = init?.headers;
      return new Response(JSON.stringify({ matches: [] }), { status: 200 });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    await provider.getLiveMatches();

    assert.notEqual(capturedHeaders, undefined);
    assert.equal(
      (capturedHeaders as Record<string, string>)['x-api-key'],
      dummyApiKey
    );
    assert.equal(
      (capturedHeaders as Record<string, string>)['User-Agent'],
      'CricLive-Engine/2.2'
    );
  });

  it('handles HTTP 401/403 authentication failures gracefully without leaking secrets', async () => {
    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
      });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'PROVIDER_UNAVAILABLE');
    assert.match(result.error?.message || '', /Authentication failure/);
    assert.equal((result.error?.message || '').includes(dummyApiKey), false);
  });

  // 2. Response Normalization
  it('normalizes verified upstream match payloads into canonical domain types', async () => {
    const sampleUpstreamMatch: UpstreamMatchPayload = {
      id: 9942,
      format: 'ODI',
      status: 'Live',
      competition: 'ICC Champions Trophy 2026',
      starts_at: '2026-10-21T09:30:00Z',
      venue: {
        id: 12,
        name: 'Dubai International Cricket Stadium',
        city: 'Dubai',
        country: 'United Arab Emirates',
      },
      teams: {
        home: { id: 1, name: 'India', code: 'IND', country: 'India' },
        away: { id: 2, name: 'Australia', code: 'AUS', country: 'Australia' },
      },
      scores: {
        home: [{ runs: 242, wickets: 4, overs: '41.2' }],
        away: [{ runs: 283, wickets: 8, overs: '50.0' }],
      },
      target: 284,
      required_run_rate: 4.85,
    };

    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ matches: [sampleUpstreamMatch] }), {
        status: 200,
      });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, true);
    assert.equal(result.data.length, 1);
    const match = result.data[0]!;

    assert.equal(match.id, '9942');
    assert.equal(match.format, 'ODI');
    assert.equal(match.status, 'LIVE');
    assert.equal(match.teams.home.name, 'India');
    assert.equal(match.teams.away.name, 'Australia');
    assert.equal(match.scores?.home?.[0]?.runs, 242);
    assert.equal(match.scores?.home?.[0]?.wickets, 4);
    assert.equal(match.scores?.home?.[0]?.overs, 41.2);
    assert.equal(match.scores?.home?.[0]?.balls, 248); // Base-6 calculation: 41*6 + 2
    assert.equal(match.target, 284);
    assert.equal(match.requiredRunRate, 4.85);

    // Provenance verification: verified real feed must NOT be tagged as demo data
    assert.equal(match.isDemo, false);
    assert.equal(match.dataSource, 'partner_api');
    assert.equal(result.metadata.isDemo, false);
    assert.equal(result.metadata.source, 'partner_api');
  });

  // 3. Handling Missing Fields Gracefully
  it('handles missing optional fields with safe fallbacks', async () => {
    const minimalMatch: UpstreamMatchPayload = {
      id: 1001,
      // Missing title, venue, scores, target, status
    };

    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ matches: [minimalMatch] }), {
        status: 200,
      });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, true);
    assert.equal(result.data.length, 1);
    const match = result.data[0]!;

    assert.equal(match.id, '1001');
    assert.equal(match.format, 'T20'); // Default format
    assert.equal(match.status, 'SCHEDULED'); // Default status
    assert.equal(match.venue.name, 'International Cricket Stadium'); // Safe default venue
    assert.deepEqual(match.scores?.home, []);
    assert.deepEqual(match.scores?.away, []);
  });

  // 4. Rate-Limiting (HTTP 429) Handling
  it('detects HTTP 429 rate limit and surfaces retry-after telemetry', async () => {
    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Retry-After': '30' },
      });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'RATE_LIMITED');
    assert.match(result.error?.message || '', /rate limit exceeded.*Retry after 30s/);
  });

  // 5. Timeout Handling
  it('handles upstream connection timeouts via AbortController', async () => {
    const mockTimeoutFetch: typeof fetch = async (_, init) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const abortError = new Error('The operation was aborted');
          abortError.name = 'AbortError';
          reject(abortError);
        });
      });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      timeoutMs: 50, // Short timeout for test
      fetchFn: mockTimeoutFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'UPSTREAM_TIMEOUT');
    assert.match(result.error?.message || '', /timed out after 50ms/);
  });

  // 6. Upstream 5xx Server Errors
  it('handles upstream 500/502/503 outages gracefully without leaking internal error details', async () => {
    const mockFetch: typeof fetch = async () => {
      return new Response('Gateway Crash', { status: 502 });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'PROVIDER_UNAVAILABLE');
    assert.match(result.error?.message || '', /responded with status 502/);
  });

  // 7. Demo vs Real Data Labeling
  it('strictly marks verified partner data as isDemo: false and mock provider as isDemo: true', async () => {
    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify({ matches: [{ id: 888, format: 'T20' }] }), {
        status: 200,
      });
    };

    const partnerProvider = new AuthorizedPartnerProvider({
      apiKey: dummyApiKey,
      baseUrl: dummyBaseUrl,
      fetchFn: mockFetch,
    });

    const partnerRes = await partnerProvider.getLiveMatches();
    assert.equal(partnerRes.metadata.isDemo, false);
    assert.equal(partnerRes.metadata.source, 'partner_api');
  });
});
