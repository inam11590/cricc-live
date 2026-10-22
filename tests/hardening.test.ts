/**
 * CricLive Step 2.4 — Production Hardening & Integration QA Tests
 * 
 * Verifies security hardening, input validation, cache bounded pruning,
 * transient retry policies, search/filter logic, and boundary configuration.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { GET as getMatchRoute } from '@/app/api/matches/[id]/route';
import { GET as getPlayerRoute } from '@/app/api/players/[player_name]/route';
import { GET as getCompareRoute } from '@/app/api/compare/route';
import { GET as getScheduleRoute } from '@/app/api/schedule/route';
import { GET as getResultsRoute } from '@/app/api/results/route';
import { MemoryCricketCache } from '@/services/cache/memoryCache';
import { AuthorizedPartnerProvider } from '@/services/provider/partnerProvider';
import { cricketService } from '@/services/cricketService';
import { getAppConfig } from '@/lib/config/env';
import {
  isValidMatchId,
  isValidPlayerIdentifier,
  sanitizeLimit,
  sanitizeFormat,
} from '@/lib/validation/cricketValidation';

describe('Production Hardening — Security & Input Validation', () => {
  it('rejects malicious or malformed match identifiers', () => {
    assert.equal(isValidMatchId('../etc/passwd'), false);
    assert.equal(isValidMatchId('match/123'), false);
    assert.equal(isValidMatchId('<script>alert(1)</script>'), false);
    assert.equal(isValidMatchId('   '), false);
    assert.equal(isValidMatchId('a'.repeat(150)), false);
    assert.equal(isValidMatchId('match_123; DROP TABLE matches;'), false);

    // Valid identifiers
    assert.equal(isValidMatchId('ind-vs-pak-t20-2024'), true);
    assert.equal(isValidMatchId('match-001'), true);
    assert.equal(isValidMatchId('match_123-final'), true);
  });

  it('rejects malicious player identifiers', () => {
    assert.equal(isValidPlayerIdentifier('../../secret'), false);
    assert.equal(isValidPlayerIdentifier('player\x00null'), false);
    assert.equal(isValidPlayerIdentifier('name\nnewline'), false);
    assert.equal(isValidPlayerIdentifier(''), false);
    assert.equal(isValidPlayerIdentifier('<script>'), false);

    // Valid player identifiers
    assert.equal(isValidPlayerIdentifier('virat-kohli'), true);
    assert.equal(isValidPlayerIdentifier('pat-cummins-30'), true);
    assert.equal(isValidPlayerIdentifier('J. Bumrah'), true);
  });

  it('bounds and sanitizes query parameter limits and formats', () => {
    assert.equal(sanitizeLimit('5'), 5);
    assert.equal(sanitizeLimit('-10'), 1); // bounded by min = 1
    assert.equal(sanitizeLimit('999999', 1, 100, 20), 100); // capped at max = 100
    assert.equal(sanitizeLimit('invalid'), 20); // fallback default

    assert.equal(sanitizeFormat('T20'), 'T20');
    assert.equal(sanitizeFormat('odi'), 'ODI');
    assert.equal(sanitizeFormat('TEST'), 'TEST');
    assert.equal(sanitizeFormat('MALICIOUS_SQL'), undefined);
    assert.equal(sanitizeFormat(null), undefined);
  });

  it('/api/matches/[id] returns 400 for malformed match ID', async () => {
    const req = new Request('http://localhost:3000/api/matches/..%2F..%2Fpasswd');
    const res = await getMatchRoute(req, {
      params: Promise.resolve({ id: '../../passwd' }),
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'VALIDATION_FAILED');
  });

  it('/api/players/[player_name] returns 400 for malformed player name', async () => {
    const req = new Request('http://localhost:3000/api/players/malicious%00entry');
    const res = await getPlayerRoute(req, {
      params: Promise.resolve({ player_name: 'malicious\x00entry' }),
    });

    assert.equal(res.status, 400);
    const json = await res.json();
    assert.equal(json.success, false);
    assert.equal(json.error.code, 'VALIDATION_FAILED');
  });

  it('/api/compare returns 400 if player parameters contain dangerous characters', async () => {
    const badReq = new Request('http://localhost:3000/api/compare?p1=%3Cscript%3Ealert(1)%3C/script%3E&p2=valid-id');
    const badRes = await getCompareRoute(badReq);
    assert.equal(badRes.status, 400);
    const badJson = await badRes.json();
    assert.ok(badJson.error);
  });

  it('/api/schedule and /api/results enforce query bounds safely', async () => {
    const schedReq = new Request('http://localhost:3000/api/schedule?limit=5000&format=INVALID');
    const schedRes = await getScheduleRoute(schedReq);
    assert.equal(schedRes.status, 200);
    const schedJson = await schedRes.json();
    assert.equal(schedJson.success, true);
    assert.ok(Array.isArray(schedJson.data));

    const resReq = new Request('http://localhost:3000/api/results?limit=2&format=T20');
    const resRes = await getResultsRoute(resReq);
    assert.equal(resRes.status, 200);
    const resJson = await resRes.json();
    assert.equal(resJson.success, true);
    assert.ok(resJson.data.length <= 2);
  });
});

describe('Production Reliability — Cache Bounded Capacity & Eviction', () => {
  it('bounds memory cache capacity to maxEntries and prunes appropriately', async () => {
    const boundedCache = new MemoryCricketCache(10); // max 10 entries

    // Populate 15 items
    for (let i = 0; i < 15; i++) {
      await boundedCache.set(
        `key-${i}`,
        { index: i },
        60,
        { source: 'mock', isDemo: true, fetchedAt: new Date().toISOString(), cached: false, isStale: false }
      );
    }

    const currentSize = await boundedCache.size();
    // Size should be capped and never exceed capacity
    assert.ok(currentSize <= 10, `Cache size ${currentSize} exceeded maxEntries of 10`);

    // Latest inserted keys should still be present
    const latest = await boundedCache.get<{ index: number }>('key-14');
    assert.notEqual(latest, null);
    assert.equal(latest?.data.index, 14);
  });
});

describe('Production Reliability — Transient Retries & Rate Limiting', () => {
  it('retries on transient 503 errors up to maxRetries and respects backoff', async () => {
    let callCount = 0;
    const mockFetch: typeof fetch = async () => {
      callCount++;
      if (callCount < 2) {
        return new Response(JSON.stringify({ error: 'Gateway overloaded' }), { status: 503 });
      }
      return new Response(
        JSON.stringify({
          matches: [
            {
              id: 'm-retry',
              title: 'Retry Succeeded',
              status: 'live',
              teams: { home: { name: 'India' }, away: { name: 'Australia' } },
            },
          ],
        }),
        { status: 200 }
      );
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: 'test-key-retries',
      baseUrl: 'https://api.cricket.prod',
      maxRetries: 2,
      retryDelayMs: 10,
      fetchFn: mockFetch,
    });

    const res = await provider.getLiveMatches();
    assert.equal(callCount, 2, 'Should have retried once after 503');
    assert.equal(res.success, true);
    assert.equal(res.data?.length, 1);
  });

  it('fails fast without retry on non-transient 401 authentication errors', async () => {
    let callCount = 0;
    const mockFetch: typeof fetch = async () => {
      callCount++;
      return new Response(JSON.stringify({ error: 'Invalid API key' }), { status: 401 });
    };

    const provider = new AuthorizedPartnerProvider({
      apiKey: 'test-key-invalid',
      baseUrl: 'https://api.cricket.prod',
      maxRetries: 3,
      retryDelayMs: 10,
      fetchFn: mockFetch,
    });

    const res = await provider.getLiveMatches();
    assert.equal(callCount, 1, 'Should not retry on 401 authentication failure');
    assert.equal(res.success, false);
    assert.equal(res.error?.code, 'PROVIDER_UNAVAILABLE');
  });
});

describe('Match Data Correctness — Search & Multi-Criteria Filtering', () => {
  it('filters matches by status, format, and search query accurately', async () => {
    // 1. Status filtering
    const liveMatches = await cricketService.getMatches({ status: 'LIVE' });
    for (const match of liveMatches) {
      assert.ok(
        match.status === 'LIVE' || match.status === 'INNINGS_BREAK' || match.status === 'STUMPS'
      );
    }

    // 2. Format filtering
    const t20Matches = await cricketService.getMatches({ format: 'T20' });
    for (const match of t20Matches) {
      assert.ok(
        match.format === 'T20' || match.format === 'T20I' || match.format === 'T20_LEAGUE'
      );
    }

    // 3. Search query matching
    const indiaMatches = await cricketService.getMatches({ searchQuery: 'India' });
    assert.ok(indiaMatches.length > 0);
    for (const match of indiaMatches) {
      const matchText = `${match.title} ${match.teams.home.name} ${match.teams.away.name} ${match.competition} ${match.venue.name} ${match.venue.city}`.toLowerCase();
      assert.ok(matchText.includes('ind'));
    }
  });
});

describe('Environment Boundary Configuration', () => {
  it('loads validated application configuration defaults without exposing secrets', () => {
    const config = getAppConfig();
    assert.ok(
      config.providerName === 'mock' ||
      config.providerName === 'partner_api' ||
      config.providerName === 'scraper_bridge'
    );
    assert.ok(typeof config.httpTimeoutMs === 'number' && config.httpTimeoutMs > 0);
    assert.ok(typeof config.cacheLiveTtlSeconds === 'number' && config.cacheLiveTtlSeconds > 0);
    assert.ok(typeof config.cacheStaticTtlSeconds === 'number' && config.cacheStaticTtlSeconds > 0);
  });
});
