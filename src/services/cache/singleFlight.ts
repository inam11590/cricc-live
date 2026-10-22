/**
 * CricLive Single-Flight Promise Deduplicator
 * 
 * Ensures concurrent requests for identical cache keys collapse into a single
 * in-flight upstream execution, eliminating the "thundering herd" or duplicate
 * provider call problem during hot traffic bursts.
 */

export class SingleFlightDeduplicator {
  private inFlight = new Map<string, Promise<unknown>>();

  /**
   * Executes the provided async factory function for the given key.
   * If a call with the exact same key is already in progress, reuses that in-flight promise.
   */
  async do<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key) as Promise<T> | undefined;
    if (existing) {
      return existing;
    }

    const promise = (async () => {
      try {
        return await fn();
      } finally {
        this.inFlight.delete(key);
      }
    })();

    this.inFlight.set(key, promise);
    return promise;
  }

  /**
   * Returns current count of active in-flight promises.
   */
  get inFlightCount(): number {
    return this.inFlight.size;
  }
}

export const singleFlight = new SingleFlightDeduplicator();
