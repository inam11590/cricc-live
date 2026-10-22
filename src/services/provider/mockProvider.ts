/**
 * CricLive Development Mock Provider
 * 
 * Deterministic cricket data provider for local development, visual testing, and CI.
 * All responses are explicitly branded with metadata:
 *   - source: 'mock'
 *   - isDemo: true
 *   - isStale: false
 * 
 * Configurable simulation flags allow testing:
 *   - Upstream network errors / provider outages
 *   - Empty response handling
 *   - Simulated latency
 */

import {
  CricketMatch,
  CricketCompetition,
  CricketPlayerProfile,
  RankingEntry,
  CricketDataResult,
  CricketDataMetadata,
} from '@/types/cricket';
import {
  MOCK_MATCHES,
  MOCK_COMPETITIONS,
  MOCK_RANKINGS,
} from '@/data/mockCricketData';
import {
  CricketDataProvider,
  FixtureFilterOptions,
  ResultFilterOptions,
  CricketSearchResult,
} from './types';

export interface MockProviderOptions {
  simulateEmpty?: boolean;
  simulateError?: boolean;
  simulateDelayMs?: number;
}

export class MockCricketProvider implements CricketDataProvider {
  readonly id = 'mock';
  private options: MockProviderOptions;

  constructor(options: MockProviderOptions = {}) {
    this.options = options;
  }

  private createMetadata(isCached = false): CricketDataMetadata {
    return {
      source: 'mock',
      isDemo: true,
      fetchedAt: '2026-10-21T12:00:00.000Z',
      cached: isCached,
      isStale: false,
    };
  }

  private async handleSimulationDelay(): Promise<void> {
    if (this.options.simulateDelayMs && this.options.simulateDelayMs > 0) {
      await new Promise((r) => setTimeout(r, this.options.simulateDelayMs));
    }
  }

  private checkSimulatedError<T>(entityName: string): CricketDataResult<T> | null {
    if (this.options.simulateError) {
      return {
        success: false,
        data: [] as unknown as T,
        metadata: this.createMetadata(),
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: `Simulated upstream provider outage when fetching ${entityName}`,
        },
      };
    }
    return null;
  }

  async getLiveMatches(): Promise<CricketDataResult<CricketMatch[]>> {
    await this.handleSimulationDelay();
    const simulated = this.checkSimulatedError<CricketMatch[]>('live matches');
    if (simulated) return simulated;

    if (this.options.simulateEmpty) {
      return {
        success: true,
        data: [],
        metadata: this.createMetadata(),
      };
    }

    const liveMatches = MOCK_MATCHES.filter(
      (m) =>
        m.status === 'LIVE' ||
        m.status === 'STUMPS' ||
        m.status === 'INNINGS_BREAK' ||
        m.status === 'TEA' ||
        m.status === 'LUNCH'
    ).map((m) => ({
      ...m,
      isDemo: true,
      isLive: true,
      dataSource: 'mock' as const,
      lastUpdatedUtc: '2026-10-21T12:00:00.000Z',
    }));

    return {
      success: true,
      data: liveMatches,
      metadata: this.createMetadata(),
    };
  }

  async getFixtures(options: FixtureFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    await this.handleSimulationDelay();
    const simulated = this.checkSimulatedError<CricketMatch[]>('fixtures');
    if (simulated) return simulated;

    if (this.options.simulateEmpty) {
      return {
        success: true,
        data: [],
        metadata: this.createMetadata(),
      };
    }

    let fixtures = MOCK_MATCHES.filter(
      (m) => m.status === 'SCHEDULED' || m.status === 'UPCOMING'
    ).map((m) => ({
      ...m,
      isDemo: true,
      dataSource: 'mock' as const,
    }));

    if (options.format && options.format !== 'ALL') {
      if (options.format === 'T20') {
        fixtures = fixtures.filter(
          (m) => m.format === 'T20' || m.format === 'T20I' || m.format === 'T20_LEAGUE'
        );
      } else {
        fixtures = fixtures.filter((m) => m.format === options.format);
      }
    }

    if (options.seriesId) {
      fixtures = fixtures.filter((m) => m.seriesId === options.seriesId);
    }

    if (options.limit && options.limit > 0) {
      fixtures = fixtures.slice(0, options.limit);
    }

    return {
      success: true,
      data: fixtures,
      metadata: this.createMetadata(),
    };
  }

  async getResults(options: ResultFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    await this.handleSimulationDelay();
    const simulated = this.checkSimulatedError<CricketMatch[]>('results');
    if (simulated) return simulated;

    if (this.options.simulateEmpty) {
      return {
        success: true,
        data: [],
        metadata: this.createMetadata(),
      };
    }

    let results = MOCK_MATCHES.filter(
      (m) => m.status === 'COMPLETED' || m.status === 'ABANDONED' || m.status === 'NO_RESULT'
    ).map((m) => ({
      ...m,
      isDemo: true,
      dataSource: 'mock' as const,
    }));

    if (options.format && options.format !== 'ALL') {
      if (options.format === 'T20') {
        results = results.filter(
          (m) => m.format === 'T20' || m.format === 'T20I' || m.format === 'T20_LEAGUE'
        );
      } else {
        results = results.filter((m) => m.format === options.format);
      }
    }

    if (options.seriesId) {
      results = results.filter((m) => m.seriesId === options.seriesId);
    }

    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return {
      success: true,
      data: results,
      metadata: this.createMetadata(),
    };
  }

  async getMatchDetails(matchId: string): Promise<CricketDataResult<CricketMatch | null>> {
    await this.handleSimulationDelay();
    if (this.options.simulateError) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: `Simulated upstream failure for match ${matchId}`,
        },
      };
    }

    if (this.options.simulateEmpty) {
      return {
        success: true,
        data: null,
        metadata: this.createMetadata(),
      };
    }

    const match = MOCK_MATCHES.find((m) => m.id === matchId || m.slug === matchId);
    if (!match) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: {
          code: 'NOT_FOUND',
          message: `Cricket match fixture '${matchId}' not found`,
        },
      };
    }

    return {
      success: true,
      data: {
        ...match,
        isDemo: true,
        dataSource: 'mock' as const,
        lastUpdatedUtc: '2026-10-21T12:00:00.000Z',
      },
      metadata: this.createMetadata(),
    };
  }

  async getPlayerStatistics(playerId: string): Promise<CricketDataResult<CricketPlayerProfile | null>> {
    await this.handleSimulationDelay();
    if (this.options.simulateError) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: `Simulated upstream failure for player ${playerId}`,
        },
      };
    }

    if (this.options.simulateEmpty) {
      return {
        success: true,
        data: null,
        metadata: this.createMetadata(),
      };
    }

    const normalizedId = playerId.toLowerCase().trim().replace(/\s+/g, '-');
    const knownProfiles: Record<string, CricketPlayerProfile> = {
      'virat-kohli': {
        id: 'virat-kohli',
        name: 'Virat Kohli',
        country: 'India',
        role: 'Top-order Batter',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm medium',
        rankings: {
          batting: { test: '9', odi: '3', t20: '--' },
          bowling: { test: '--', odi: '--', t20: '--' },
        },
        batting_stats: {
          test: { matches: '118', runs: '9040', highest_score: '254*', average: '48.86', strike_rate: '55.8', hundreds: '29', fifties: '31' },
          odi: { matches: '295', runs: '13906', highest_score: '183', average: '58.18', strike_rate: '93.5', hundreds: '50', fifties: '72' },
          t20: { matches: '125', runs: '4188', highest_score: '122*', average: '48.69', strike_rate: '137.0', hundreds: '1', fifties: '38' },
        },
        bowling_stats: {
          test: { balls: '175', runs: '84', wickets: '0', best_bowling_innings: '0/0', economy: '2.88', five_wickets: '0' },
          odi: { balls: '641', runs: '665', wickets: '5', best_bowling_innings: '1/13', economy: '6.22', five_wickets: '0' },
          t20: { balls: '152', runs: '204', wickets: '4', best_bowling_innings: '1/13', economy: '8.05', five_wickets: '0' },
        },
      },
      'babar-azam': {
        id: 'babar-azam',
        name: 'Babar Azam',
        country: 'Pakistan',
        role: 'Top-order Batter',
        battingStyle: 'Right-hand bat',
        bowlingStyle: 'Right-arm offbreak',
        rankings: {
          batting: { test: '14', odi: '1', t20: '4' },
          bowling: { test: '--', odi: '--', t20: '--' },
        },
        batting_stats: {
          test: { matches: '55', runs: '3998', highest_score: '196', average: '44.92', strike_rate: '55.1', hundreds: '9', fifties: '26' },
          odi: { matches: '117', runs: '5729', highest_score: '158', average: '56.72', strike_rate: '88.8', hundreds: '19', fifties: '32' },
          t20: { matches: '123', runs: '4145', highest_score: '122', average: '41.03', strike_rate: '129.1', hundreds: '3', fifties: '36' },
        },
        bowling_stats: {
          test: { balls: '12', runs: '12', wickets: '0', best_bowling_innings: '0/1', economy: '6.00', five_wickets: '0' },
          odi: { balls: '12', runs: '10', wickets: '0', best_bowling_innings: '0/10', economy: '5.00', five_wickets: '0' },
          t20: { balls: '0', runs: '0', wickets: '0', best_bowling_innings: '--', economy: '0.00', five_wickets: '0' },
        },
      },
    };

    const profile = knownProfiles[normalizedId];
    if (!profile) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: {
          code: 'NOT_FOUND',
          message: `Player statistics not found for '${playerId}'`,
        },
      };
    }

    return {
      success: true,
      data: profile,
      metadata: this.createMetadata(),
    };
  }

  async getCompetitions(): Promise<CricketDataResult<CricketCompetition[]>> {
    await this.handleSimulationDelay();
    return {
      success: true,
      data: MOCK_COMPETITIONS,
      metadata: this.createMetadata(),
    };
  }

  async getRankings(
    category: 'teams' | 'batting' | 'bowling',
    format: 'TEST' | 'ODI' | 'T20I'
  ): Promise<CricketDataResult<RankingEntry[]>> {
    await this.handleSimulationDelay();
    const rankings = MOCK_RANKINGS[category]?.[format] || [];

    return {
      success: true,
      data: rankings,
      metadata: this.createMetadata(),
    };
  }

  async searchMatches(query: string): Promise<CricketDataResult<CricketSearchResult>> {
    await this.handleSimulationDelay();
    const q = query.toLowerCase().trim();
    if (!q) {
      return {
        success: true,
        data: { matches: [], competitions: [], teams: [] },
        metadata: this.createMetadata(),
      };
    }

    const matches = MOCK_MATCHES.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.teams.home.name.toLowerCase().includes(q) ||
        m.teams.away.name.toLowerCase().includes(q) ||
        m.competition.toLowerCase().includes(q)
    );

    const competitions = MOCK_COMPETITIONS.filter(
      (c) => c.name.toLowerCase().includes(q) || c.shortName.toLowerCase().includes(q)
    );

    const teamsMap = new Map<string, { name: string; code: string; country: string }>();
    MOCK_MATCHES.forEach((m) => {
      [m.teams.home, m.teams.away].forEach((t) => {
        if (
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          (t.country && t.country.toLowerCase().includes(q))
        ) {
          teamsMap.set(t.code, {
            name: t.name,
            code: t.code,
            country: t.country || t.name,
          });
        }
      });
    });

    return {
      success: true,
      data: {
        matches,
        competitions,
        teams: Array.from(teamsMap.values()),
      },
      metadata: this.createMetadata(),
    };
  }
}
