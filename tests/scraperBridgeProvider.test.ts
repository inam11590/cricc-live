import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ScraperBridgeProvider } from '../src/services/provider/scraperBridgeProvider';
import { ProviderConfigurationError } from '../src/services/provider/factory';

describe('ScraperBridgeProvider', () => {
  const dummyServiceUrl = 'http://localhost:5000';

  it('throws ProviderConfigurationError when initialized without serviceUrl', () => {
    assert.throws(
      () => {
        new ScraperBridgeProvider({ serviceUrl: '' });
      },
      (err: unknown) => {
        assert.equal(err instanceof ProviderConfigurationError, true);
        assert.match(
          (err as Error).message,
          /CRICLIVE_SCRAPER_SERVICE_URL is required/
        );
        return true;
      }
    );
  });

  it('parses raw text score lines from scraper /live endpoint into structured CricketMatch', async () => {
    const rawScores = [
      'RCB 196-7 (20 Ovs) CSK 9-2 (2.3 Ovs) Chennai Super Kings need 188 runs',
    ];

    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify(rawScores), { status: 200 });
    };

    const provider = new ScraperBridgeProvider({
      serviceUrl: dummyServiceUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, true);
    assert.equal(result.data.length, 1);
    const match = result.data[0]!;

    assert.equal(match.teams.home.code, 'RCB');
    assert.equal(match.scores?.home?.[0]?.runs, 196);
    assert.equal(match.scores?.home?.[0]?.wickets, 7);
    assert.equal(match.scores?.home?.[0]?.overs, 20.0);
    assert.equal(match.scores?.home?.[0]?.balls, 120);

    assert.equal(match.teams.away.code, 'CSK');
    assert.equal(match.scores?.away?.[0]?.runs, 9);
    assert.equal(match.scores?.away?.[0]?.wickets, 2);
    assert.equal(match.scores?.away?.[0]?.overs, 2.3);
    assert.equal(match.scores?.away?.[0]?.balls, 15); // 2*6 + 3 = 15 balls

    assert.equal(result.metadata.source, 'cricbuzz_scraper');
    assert.equal(result.metadata.isDemo, false);
  });

  it('parses scheduled fixture strings from scraper /schedule endpoint', async () => {
    const rawSchedule = [
      'India vs South Africa, 1st ODI',
      'Australia vs England, 2nd Test',
    ];

    const mockFetch: typeof fetch = async () => {
      return new Response(JSON.stringify(rawSchedule), { status: 200 });
    };

    const provider = new ScraperBridgeProvider({
      serviceUrl: dummyServiceUrl,
      fetchFn: mockFetch,
    });

    const result = await provider.getFixtures();

    assert.equal(result.success, true);
    assert.equal(result.data.length, 2);
    assert.equal(result.data[0]?.title, 'India vs South Africa');
    assert.equal(result.data[0]?.teams.home.name, 'India');
    assert.equal(result.data[0]?.teams.away.name, 'South Africa');
    assert.equal(result.data[0]?.status, 'SCHEDULED');
  });

  it('handles scraper microservice connection timeouts gracefully', async () => {
    const mockTimeoutFetch: typeof fetch = async (_, init) => {
      return new Promise((_, reject) => {
        init?.signal?.addEventListener('abort', () => {
          const abortError = new Error('The operation was aborted');
          abortError.name = 'AbortError';
          reject(abortError);
        });
      });
    };

    const provider = new ScraperBridgeProvider({
      serviceUrl: dummyServiceUrl,
      timeoutMs: 50,
      fetchFn: mockTimeoutFetch,
    });

    const result = await provider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'UPSTREAM_TIMEOUT');
    assert.match(result.error?.message || '', /timed out after 50ms/);
  });
});
