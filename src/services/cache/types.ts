/**
 * CricLive Caching Architecture
 * 
 * Defines standard interfaces for caching live and static cricket data with explicit TTLs,
 * cache namespaces, and hit/miss telemetry.
 */

import { CricketDataMetadata } from '@/types/cricket';

export interface CachedEntry<T> {
  data: T;
  metadata: CricketDataMetadata;
  expiresAt: number; // Unix timestamp in ms
  storedAt: number; // Unix timestamp in ms
}

export interface CricketCache {
  /**
   * Retrieves a typed entry from the cache. Returns null if missing or expired.
   */
  get<T>(key: string): Promise<CachedEntry<T> | null>;

  /**
   * Retrieves an entry even if expired, for controlled stale-on-error fallback.
   */
  getStale<T>(key: string): Promise<CachedEntry<T> | null>;

  /**
   * Stores an entry in the cache with the given TTL in seconds.
   */
  set<T>(
    key: string,
    data: T,
    ttlSeconds: number,
    metadata: CricketDataMetadata
  ): Promise<void>;

  /**
   * Explicitly evicts an entry by key.
   */
  delete(key: string): Promise<void>;

  /**
   * Clears the entire cache or an optional namespace prefix.
   */
  clear(prefix?: string): Promise<void>;

  /**
   * Returns cache size metrics.
   */
  size(): Promise<number>;
}

/**
 * Builds a deterministic, collision-free cache key.
 * Format: criclive:v1:<namespace>[:<paramKey>=<paramValue>...]
 */
export function buildCacheKey(
  namespace: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const base = `criclive:v1:${namespace.toLowerCase().trim()}`;
  if (!params) return base;

  const paramSegments = Object.entries(params)
    .filter(([, val]) => val !== undefined && val !== null && val !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${encodeURIComponent(String(val))}`);

  if (paramSegments.length === 0) return base;
  return `${base}:${paramSegments.join(':')}`;
}
