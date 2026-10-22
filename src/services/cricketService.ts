/**
 * CricLive Cricket Data Service
 * 
 * Central orchestration service that bridges application routes, caching,
 * single-flight request deduplication, runtime payload validation, and the
 * configured CricketDataProvider.
 */

import {
  CricketMatch,
  CricketCompetition,
  CricketPlayerProfile,
  RankingEntry,
  EditorialArticle,
  MatchFormat,
  CricketDataResult,
  CricketDataSource,
} from '@/types/cricket';
import { MOCK_EDITORIALS } from '@/data/mockCricketData';
import { CricketProviderFactory } from './provider/factory';
import {
  CricketDataProvider,
  FixtureFilterOptions,
  ResultFilterOptions,
  MatchFilterOptions,
  CricketSearchResult,
} from './provider/types';
import { defaultCache } from './cache/memoryCache';
import { CricketCache, buildCacheKey } from './cache/types';
import { singleFlight, SingleFlightDeduplicator } from './cache/singleFlight';
import { validateCricketMatch, validatePlayerProfile, isValidMatchId, isValidPlayerIdentifier } from '@/lib/validation/cricketValidation';
import { getAppConfig } from '@/lib/config/env';

export interface CricketServiceConfig {
  cache?: CricketCache;
  deduplicator?: SingleFlightDeduplicator;
  liveTtlSeconds?: number;
  staticTtlSeconds?: number;
}

export class CricketService {
  private cache: CricketCache;
  private deduplicator: SingleFlightDeduplicator;
  private liveTtl: number;
  private staticTtl: number;

  constructor(config: CricketServiceConfig = {}) {
    const appConfig = getAppConfig();
    this.cache = config.cache || defaultCache;
    this.deduplicator = config.deduplicator || singleFlight;
    this.liveTtl = config.liveTtlSeconds ?? appConfig.cacheLiveTtlSeconds;
    this.staticTtl = config.staticTtlSeconds ?? appConfig.cacheStaticTtlSeconds;
  }

  private getProvider(): CricketDataProvider {
    return CricketProviderFactory.getProvider();
  }

  // ==========================================
  // 1. Result Methods with Metadata & Caching
  // ==========================================

  async getLiveMatchesResult(): Promise<CricketDataResult<CricketMatch[]>> {
    const cacheKey = buildCacheKey('live-matches');
    const cached = await this.cache.get<CricketMatch[]>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: {
          ...cached.metadata,
          cached: true,
        },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      // Recheck cache in case another flight populated it
      const secondCheck = await this.cache.get<CricketMatch[]>(cacheKey);
      if (secondCheck) {
        return {
          success: true,
          data: secondCheck.data,
          metadata: { ...secondCheck.metadata, cached: true },
        };
      }

      const result = await this.getProvider().getLiveMatches();
      if (result.success && result.data) {
        // Validate each match before caching
        const validated = result.data.filter((m) => validateCricketMatch(m).valid);
        await this.cache.set(cacheKey, validated, this.liveTtl, result.metadata);
        return {
          ...result,
          data: validated,
        };
      }

      // Controlled stale-on-error fallback: serve cached data marked isStale: true
      const stale = await this.cache.getStale<CricketMatch[]>(cacheKey);
      if (stale) {
        return {
          success: true,
          data: stale.data,
          metadata: stale.metadata,
          error: result.error,
        };
      }

      return result;
    });
  }

  async getFixturesResult(options: FixtureFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    const cacheKey = buildCacheKey('fixtures', options as Record<string, string | number>);
    const cached = await this.cache.get<CricketMatch[]>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const secondCheck = await this.cache.get<CricketMatch[]>(cacheKey);
      if (secondCheck) {
        return {
          success: true,
          data: secondCheck.data,
          metadata: { ...secondCheck.metadata, cached: true },
        };
      }

      const result = await this.getProvider().getFixtures(options);
      if (result.success && result.data) {
        const validated = result.data.filter((m) => validateCricketMatch(m).valid);
        await this.cache.set(cacheKey, validated, this.staticTtl, result.metadata);
        return {
          ...result,
          data: validated,
        };
      }

      const stale = await this.cache.getStale<CricketMatch[]>(cacheKey);
      if (stale) {
        return {
          success: true,
          data: stale.data,
          metadata: stale.metadata,
          error: result.error,
        };
      }

      return result;
    });
  }

  async getResultsResult(options: ResultFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    const cacheKey = buildCacheKey('results', options as Record<string, string | number>);
    const cached = await this.cache.get<CricketMatch[]>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const secondCheck = await this.cache.get<CricketMatch[]>(cacheKey);
      if (secondCheck) {
        return {
          success: true,
          data: secondCheck.data,
          metadata: { ...secondCheck.metadata, cached: true },
        };
      }

      const result = await this.getProvider().getResults(options);
      if (result.success && result.data) {
        const validated = result.data.filter((m) => validateCricketMatch(m).valid);
        await this.cache.set(cacheKey, validated, this.staticTtl, result.metadata);
        return {
          ...result,
          data: validated,
        };
      }

      const stale = await this.cache.getStale<CricketMatch[]>(cacheKey);
      if (stale) {
        return {
          success: true,
          data: stale.data,
          metadata: stale.metadata,
          error: result.error,
        };
      }

      return result;
    });
  }

  async getMatchDetailsResult(matchId: string): Promise<CricketDataResult<CricketMatch | null>> {
    if (!isValidMatchId(matchId)) {
      return {
        success: false,
        data: null,
        metadata: {
          source: (this.getProvider().id as CricketDataSource) || 'mock',
          cached: false,
          fetchedAt: new Date().toISOString(),
          isDemo: this.getProvider().id === 'mock',
          isStale: false,
        },
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid match identifier provided',
        },
      };
    }

    const cacheKey = buildCacheKey('match', { id: matchId });
    const cached = await this.cache.get<CricketMatch | null>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const secondCheck = await this.cache.get<CricketMatch | null>(cacheKey);
      if (secondCheck) {
        return {
          success: true,
          data: secondCheck.data,
          metadata: { ...secondCheck.metadata, cached: true },
        };
      }

      const result = await this.getProvider().getMatchDetails(matchId);
      if (result.success && result.data) {
        const validation = validateCricketMatch(result.data);
        if (validation.valid && validation.data) {
          // Dynamic TTL: Live matches expire fast, completed matches expire slowly
          const isMatchLive =
            validation.data.status === 'LIVE' ||
            validation.data.status === 'INNINGS_BREAK' ||
            validation.data.status === 'STUMPS';
          const ttl = isMatchLive ? this.liveTtl : this.staticTtl;

          await this.cache.set(cacheKey, validation.data, ttl, result.metadata);
          return {
            ...result,
            data: validation.data,
          };
        }
      }

      const stale = await this.cache.getStale<CricketMatch | null>(cacheKey);
      if (stale) {
        return {
          success: true,
          data: stale.data,
          metadata: stale.metadata,
          error: result.error,
        };
      }

      return result;
    });
  }

  async getPlayerStatisticsResult(playerId: string): Promise<CricketDataResult<CricketPlayerProfile | null>> {
    if (!isValidPlayerIdentifier(playerId)) {
      return {
        success: false,
        data: null,
        metadata: {
          source: (this.getProvider().id as CricketDataSource) || 'mock',
          cached: false,
          fetchedAt: new Date().toISOString(),
          isDemo: this.getProvider().id === 'mock',
          isStale: false,
        },
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid player identifier provided',
        },
      };
    }

    const cacheKey = buildCacheKey('player', { id: playerId });
    const cached = await this.cache.get<CricketPlayerProfile | null>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const secondCheck = await this.cache.get<CricketPlayerProfile | null>(cacheKey);
      if (secondCheck) {
        return {
          success: true,
          data: secondCheck.data,
          metadata: { ...secondCheck.metadata, cached: true },
        };
      }

      const result = await this.getProvider().getPlayerStatistics(playerId);
      if (result.success && result.data) {
        const validation = validatePlayerProfile(result.data);
        if (validation.valid && validation.data) {
          await this.cache.set(cacheKey, validation.data, this.staticTtl, result.metadata);
          return {
            ...result,
            data: validation.data,
          };
        }
      }

      return result;
    });
  }

  async getCompetitionsResult(): Promise<CricketDataResult<CricketCompetition[]>> {
    const cacheKey = buildCacheKey('competitions');
    const cached = await this.cache.get<CricketCompetition[]>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const result = await this.getProvider().getCompetitions();
      if (result.success && result.data) {
        await this.cache.set(cacheKey, result.data, this.staticTtl, result.metadata);
      }
      return result;
    });
  }

  async getRankingsResult(
    category: 'teams' | 'batting' | 'bowling',
    format: 'TEST' | 'ODI' | 'T20I'
  ): Promise<CricketDataResult<RankingEntry[]>> {
    const cacheKey = buildCacheKey('rankings', { category, format });
    const cached = await this.cache.get<RankingEntry[]>(cacheKey);

    if (cached) {
      return {
        success: true,
        data: cached.data,
        metadata: { ...cached.metadata, cached: true },
      };
    }

    return this.deduplicator.do(cacheKey, async () => {
      const result = await this.getProvider().getRankings(category, format);
      if (result.success && result.data) {
        await this.cache.set(cacheKey, result.data, this.staticTtl, result.metadata);
      }
      return result;
    });
  }

  async searchMatchesResult(query: string): Promise<CricketDataResult<CricketSearchResult>> {
    return this.getProvider().searchMatches(query);
  }

  // ==========================================
  // 2. High-Level Facade Methods for UI & SSR
  // ==========================================

  async getMatches(options: MatchFilterOptions = {}): Promise<CricketMatch[]> {
    const [liveRes, fixturesRes, resultsRes] = await Promise.all([
      this.getLiveMatchesResult(),
      this.getFixturesResult(),
      this.getResultsResult(),
    ]);

    const all: CricketMatch[] = [];
    if (liveRes.success) all.push(...liveRes.data);
    if (fixturesRes.success) all.push(...fixturesRes.data);
    if (resultsRes.success) all.push(...resultsRes.data);

    // Deduplicate by match ID
    const matchMap = new Map<string, CricketMatch>();
    for (const m of all) {
      matchMap.set(m.id, m);
    }
    let filtered = Array.from(matchMap.values());

    // Status filter
    if (options.status && options.status !== 'ALL') {
      if (options.status === 'LIVE') {
        filtered = filtered.filter(
          (m) => m.status === 'LIVE' || m.status === 'STUMPS' || m.status === 'INNINGS_BREAK'
        );
      } else {
        filtered = filtered.filter((m) => m.status === options.status);
      }
    }

    // Format filter
    if (options.format && options.format !== 'ALL') {
      if (options.format === 'T20') {
        filtered = filtered.filter(
          (m) => m.format === 'T20' || m.format === 'T20I' || m.format === 'T20_LEAGUE'
        );
      } else {
        filtered = filtered.filter((m) => m.format === options.format);
      }
    }

    // Series filter
    if (options.seriesId) {
      filtered = filtered.filter((m) => m.seriesId === options.seriesId);
    }

    // Search query
    if (options.searchQuery && options.searchQuery.trim().length > 0) {
      const q = options.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.teams.home.name.toLowerCase().includes(q) ||
          m.teams.away.name.toLowerCase().includes(q) ||
          m.teams.home.code.toLowerCase().includes(q) ||
          m.teams.away.code.toLowerCase().includes(q) ||
          m.competition.toLowerCase().includes(q) ||
          m.venue.city.toLowerCase().includes(q) ||
          m.venue.name.toLowerCase().includes(q)
      );
    }

    if (options.limit && options.limit > 0) {
      filtered = filtered.slice(0, options.limit);
    }

    return filtered;
  }

  async getMatchById(id: string): Promise<CricketMatch | null> {
    const result = await this.getMatchDetailsResult(id);
    return result.success ? result.data : null;
  }

  async getMatchBySlug(slug: string): Promise<CricketMatch | null> {
    return this.getMatchById(slug);
  }

  async getFeaturedMatch(): Promise<CricketMatch | null> {
    const liveRes = await this.getLiveMatchesResult();
    if (liveRes.success && liveRes.data.length > 0) {
      const featured = liveRes.data.find((m) => m.isFeatured);
      if (featured) return featured;
      return liveRes.data[0] || null;
    }

    const all = await this.getMatches();
    return all.find((m) => m.isFeatured) || all[0] || null;
  }

  async getLiveMatches(): Promise<CricketMatch[]> {
    const res = await this.getLiveMatchesResult();
    return res.success ? res.data : [];
  }

  async getSchedule(options: { format?: MatchFormat; limit?: number } = {}): Promise<CricketMatch[]> {
    const res = await this.getFixturesResult(options);
    return res.success ? res.data : [];
  }

  async getResults(options: { format?: MatchFormat; limit?: number } = {}): Promise<CricketMatch[]> {
    const res = await this.getResultsResult(options);
    return res.success ? res.data : [];
  }

  async getCompetitions(): Promise<CricketCompetition[]> {
    const res = await this.getCompetitionsResult();
    return res.success ? res.data : [];
  }

  async getRankings(
    category: 'teams' | 'batting' | 'bowling',
    format: 'TEST' | 'ODI' | 'T20I'
  ): Promise<RankingEntry[]> {
    const res = await this.getRankingsResult(category, format);
    return res.success ? res.data : [];
  }

  async getEditorials(): Promise<EditorialArticle[]> {
    return MOCK_EDITORIALS;
  }

  async search(query: string): Promise<CricketSearchResult> {
    const res = await this.searchMatchesResult(query);
    return res.success ? res.data : { matches: [], competitions: [], teams: [] };
  }

  async getPlayerStatistics(playerId: string): Promise<CricketPlayerProfile | null> {
    const res = await this.getPlayerStatisticsResult(playerId);
    return res.success ? res.data : null;
  }
}

// Global service instance
export const cricketService = new CricketService();
