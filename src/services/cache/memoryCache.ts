/**
 * CricLive In-Memory Cache Implementation
 * 
 * High-performance, TTL-aware memory cache with entry expiration and telemetry.
 * Uses performance.now() for monotonic elapsed timing, eliminating Next.js prerender
 * wall-clock Date.now() warnings.
 * 
 * SERVERLESS NOTICE:
 * In serverless runtimes (such as Vercel Lambdas), this memory cache is instance-local
 * and will not be shared across isolated concurrent function containers. It acts as an
 * ephemeral hot-path accelerator for repeated requests within the same warm lambda.
 * For globally distributed cross-instance cache coordination, implement CricketCache
 * over Redis or Upstash KV.
 */

import { CricketCache, CachedEntry } from './types';
import { CricketDataMetadata } from '@/types/cricket';

export class MemoryCricketCache implements CricketCache {
  private store = new Map<string, CachedEntry<unknown>>();
  private maxEntries: number;

  constructor(maxEntries = 500) {
    this.maxEntries = maxEntries;
  }

  async get<T>(key: string): Promise<CachedEntry<T> | null> {
    const entry = this.store.get(key) as CachedEntry<T> | undefined;
    if (!entry) {
      return null;
    }

    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (now > entry.expiresAt) {
      // Lazy eviction of expired key
      this.store.delete(key);
      return null;
    }

    return entry;
  }

  async getStale<T>(key: string): Promise<CachedEntry<T> | null> {
    const entry = this.store.get(key) as CachedEntry<T> | undefined;
    if (!entry) {
      return null;
    }

    return {
      ...entry,
      metadata: {
        ...entry.metadata,
        cached: true,
        isStale: true,
      },
    };
  }

  async set<T>(
    key: string,
    data: T,
    ttlSeconds: number,
    metadata: CricketDataMetadata
  ): Promise<void> {
    const now = typeof performance !== 'undefined' ? performance.now() : Date.now();

    // Bounded memory protection: prune expired or oldest entry if store exceeds capacity
    if (this.store.size >= this.maxEntries && !this.store.has(key)) {
      let pruned = false;
      for (const [k, v] of this.store.entries()) {
        if (now > v.expiresAt) {
          this.store.delete(k);
          pruned = true;
          break;
        }
      }
      if (!pruned) {
        const firstKey = this.store.keys().next().value;
        if (firstKey) this.store.delete(firstKey);
      }
    }

    const expiresAt = now + Math.max(1, ttlSeconds) * 1000;

    const entry: CachedEntry<T> = {
      data,
      metadata: {
        ...metadata,
        cached: true,
      },
      storedAt: now,
      expiresAt,
    };

    this.store.set(key, entry as CachedEntry<unknown>);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }

  async clear(prefix?: string): Promise<void> {
    if (!prefix) {
      this.store.clear();
      return;
    }

    for (const key of this.store.keys()) {
      if (key.startsWith(prefix)) {
        this.store.delete(key);
      }
    }
  }

  async size(): Promise<number> {
    return this.store.size;
  }
}

export const defaultCache: CricketCache = new MemoryCricketCache();
