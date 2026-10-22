import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { MemoryCricketCache } from '../src/services/cache/memoryCache';
import { buildCacheKey } from '../src/services/cache/types';
import { SingleFlightDeduplicator } from '../src/services/cache/singleFlight';
import { CricketDataMetadata } from '../src/types/cricket';

describe('Cricket Cache & Deduplication Boundary', () => {
  let cache: MemoryCricketCache;

  beforeEach(() => {
    cache = new MemoryCricketCache();
  });

  const sampleMetadata: CricketDataMetadata = {
    source: 'mock',
    isDemo: true,
    fetchedAt: new Date().toISOString(),
    cached: false,
    isStale: false,
  };

  it('builds deterministic, collision-free cache keys', () => {
    const key1 = buildCacheKey('fixtures', { format: 'ODI', limit: 10 });
    const key2 = buildCacheKey('fixtures', { limit: 10, format: 'ODI' }); // different param order
    assert.equal(key1, key2);
    assert.equal(key1, 'criclive:v1:fixtures:format=ODI:limit=10');

    const keyDifferent = buildCacheKey('match', { id: 'ind-vs-aus' });
    assert.equal(keyDifferent, 'criclive:v1:match:id=ind-vs-aus');
    assert.notEqual(key1, keyDifferent);
  });

  it('sets and retrieves cached entries before expiration', async () => {
    await cache.set('test-key', { score: '242/4' }, 60, sampleMetadata);
    const hit = await cache.get<{ score: string }>('test-key');

    assert.notEqual(hit, null);
    assert.equal(hit?.data.score, '242/4');
    assert.equal(hit?.metadata.cached, true);
  });

  it('evicts expired cache entries automatically', async () => {
    // 1 second TTL
    await cache.set('short-lived', 'temporary-data', 1, sampleMetadata);

    // Immediate check hits
    const hit = await cache.get<string>('short-lived');
    assert.equal(hit?.data, 'temporary-data');

    // Wait 1.1s for expiration
    await new Promise((r) => setTimeout(r, 1100));

    const expired = await cache.get<string>('short-lived');
    assert.equal(expired, null);
  });

  it('single-flight deduplicator collapses concurrent identical requests into one call', async () => {
    const deduplicator = new SingleFlightDeduplicator();
    let upstreamCallCount = 0;

    const mockSlowFetch = async () => {
      upstreamCallCount++;
      await new Promise((r) => setTimeout(r, 50));
      return { result: 'data-payload', count: upstreamCallCount };
    };

    // Fire 5 concurrent calls with the same key
    const promises = [
      deduplicator.do('concurrent-key', mockSlowFetch),
      deduplicator.do('concurrent-key', mockSlowFetch),
      deduplicator.do('concurrent-key', mockSlowFetch),
      deduplicator.do('concurrent-key', mockSlowFetch),
      deduplicator.do('concurrent-key', mockSlowFetch),
    ];

    const results = await Promise.all(promises);

    // All 5 callers get the exact same result
    assert.equal(results.length, 5);
    for (const res of results) {
      assert.equal(res.result, 'data-payload');
      assert.equal(res.count, 1);
    }

    // Upstream was invoked exactly ONCE instead of 5 times!
    assert.equal(upstreamCallCount, 1);
  });
});
