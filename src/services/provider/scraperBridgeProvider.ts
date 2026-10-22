/**
 * CricLive Scraper Bridge Provider
 * 
 * Adapter for an isolated external Python microservice running the reference Cricket-API.
 * 
 * ARCHITECTURAL ISOLATION:
 * The Python Flask scraper must NEVER be bundled into Vercel frontend lambdas.
 * When deployed as an independent container service, this adapter normalizes its
 * text-based endpoints (/live, /schedule, /players/<name>) into canonical CricLive models.
 */

import {
  CricketMatch,
  CricketCompetition,
  CricketPlayerProfile,
  RankingEntry,
  MatchFormat,
  CricketDataResult,
  CricketDataMetadata,
  CricketDataError,
} from '@/types/cricket';
import {
  CricketDataProvider,
  FixtureFilterOptions,
  CricketSearchResult,
} from './types';
import { parseCricketOvers } from '@/lib/cricketOvers';
import { ProviderConfigurationError } from './factory';

export interface ScraperBridgeConfig {
  serviceUrl?: string;
  timeoutMs?: number;
  fetchFn?: typeof fetch;
}

export class ScraperBridgeProvider implements CricketDataProvider {
  readonly id = 'scraper_bridge';
  private serviceUrl: string;
  private timeoutMs: number;
  private fetchFn: typeof fetch;

  constructor(config: ScraperBridgeConfig = {}) {
    this.serviceUrl = (
      config.serviceUrl ||
      process.env.CRICLIVE_SCRAPER_SERVICE_URL ||
      ''
    ).replace(/\/+$/, '');
    this.timeoutMs =
      config.timeoutMs ??
      parseInt(process.env.CRICLIVE_HTTP_TIMEOUT_MS || '5000', 10);
    this.fetchFn = config.fetchFn || globalThis.fetch;

    if (!this.serviceUrl) {
      throw new ProviderConfigurationError(
        'CRICLIVE_SCRAPER_SERVICE_URL is required to initialize ScraperBridgeProvider. Please configure the URL of the running Python scraper service or switch CRICLIVE_DATA_PROVIDER to "mock".'
      );
    }
  }

  private createMetadata(isCached = false): CricketDataMetadata {
    return {
      source: 'cricbuzz_scraper',
      isDemo: false,
      fetchedAt: new Date().toISOString(),
      cached: isCached,
      isStale: false,
    };
  }

  private async request<T>(endpoint: string): Promise<{ data?: T; error?: CricketDataError }> {
    const url = `${this.serviceUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.fetchFn(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'User-Agent': 'CricLive-Bridge/2.2',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutHandle);

      if (!response.ok) {
        return {
          error: {
            code: 'PROVIDER_UNAVAILABLE',
            message: `Scraper service responded with status ${response.status}`,
          },
        };
      }

      const json = await response.json();
      return { data: json as T };
    } catch (err: unknown) {
      clearTimeout(timeoutHandle);

      if (err instanceof Error && err.name === 'AbortError') {
        return {
          error: {
            code: 'UPSTREAM_TIMEOUT',
            message: `Request to scraper service timed out after ${this.timeoutMs}ms`,
          },
        };
      }

      return {
        error: {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Failed to communicate with external scraper microservice',
        },
      };
    }
  }

  /**
   * Normalizes raw scraper live score strings into canonical CricketMatch structure.
   * Example input: "RCB196-7 (20 Ovs) CSK9-2 (2.3 Ovs) Chennai Super Kings need 188 runs"
   */
  private parseLiveMatchString(raw: string, index: number): CricketMatch {
    const matchId = `scraped-live-${index + 1}`;
    const format: MatchFormat = raw.includes('Ovs') && raw.includes('20') ? 'T20' : 'ODI';

    // Regex extraction of team scores
    // Matches patterns like "RCB 196-7 (20 Ovs)" or "CSK 9-2 (2.3 Ovs)"
    const scoreRegex = /([A-Za-z]+)\s*(\d+)[-/](\d+)\s*\(([\d.]+)\s*Ovs?\)/gi;
    const matches = Array.from(raw.matchAll(scoreRegex));

    let homeTeam = { name: 'Team A', code: 'TMA' };
    let awayTeam = { name: 'Team B', code: 'TMB' };
    const homeScores = [];
    const awayScores = [];

    if (matches[0]) {
      const [, code, runs, wickets, overs] = matches[0];
      homeTeam = { name: code || 'Home', code: (code || 'HME').toUpperCase() };
      const parsedOvers = parseCricketOvers(overs);
      homeScores.push({
        teamId: 'home',
        inningsNumber: 1 as const,
        runs: parseInt(runs || '0', 10),
        wickets: parseInt(wickets || '0', 10),
        overs: parsedOvers.asFloat,
        balls: parsedOvers.totalBalls,
      });
    }

    if (matches[1]) {
      const [, code, runs, wickets, overs] = matches[1];
      awayTeam = { name: code || 'Away', code: (code || 'AWY').toUpperCase() };
      const parsedOvers = parseCricketOvers(overs);
      awayScores.push({
        teamId: 'away',
        inningsNumber: 2 as const,
        runs: parseInt(runs || '0', 10),
        wickets: parseInt(wickets || '0', 10),
        overs: parsedOvers.asFloat,
        balls: parsedOvers.totalBalls,
      });
    }

    return {
      id: matchId,
      slug: matchId,
      title: `${homeTeam.name} vs ${awayTeam.name}`,
      shortTitle: `${homeTeam.code} vs ${awayTeam.code}`,
      competition: 'Live Cricket Broadcast',
      format,
      status: 'LIVE',
      statusText: raw,
      venue: {
        id: 'venue-scraped',
        name: 'Live Match Arena',
        city: 'Stadium',
        country: '',
      },
      startTimeUtc: new Date().toISOString(),
      teams: {
        home: homeTeam,
        away: awayTeam,
      },
      scores: {
        home: homeScores,
        away: awayScores,
      },
      isLive: true,
      isDemo: false,
      dataSource: 'cricbuzz_scraper',
      lastUpdatedUtc: new Date().toISOString(),
    };
  }

  async getLiveMatches(): Promise<CricketDataResult<CricketMatch[]>> {
    const res = await this.request<string[]>('/live');

    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error,
      };
    }

    const matches = (Array.isArray(res.data) ? res.data : []).map((line, idx) =>
      this.parseLiveMatchString(line, idx)
    );

    return {
      success: true,
      data: matches,
      metadata: this.createMetadata(),
    };
  }

  async getFixtures(options: FixtureFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    const res = await this.request<string[]>('/schedule');

    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error,
      };
    }

    const fixtures: CricketMatch[] = (Array.isArray(res.data) ? res.data : []).map((line, idx) => {
      const parts = line.split(',');
      const matchup = parts[0]?.trim() || line;
      const tournament = parts[1]?.trim() || 'Scheduled Series';

      const teams = matchup.split(/\s+vs\s+/i);
      const homeName = teams[0]?.trim() || 'Team A';
      const awayName = teams[1]?.trim() || 'Team B';

      return {
        id: `scraped-fixture-${idx + 1}`,
        slug: `fixture-${idx + 1}`,
        title: matchup,
        shortTitle: `${homeName.slice(0, 3).toUpperCase()} vs ${awayName.slice(0, 3).toUpperCase()}`,
        competition: tournament,
        format: 'ODI',
        status: 'SCHEDULED',
        statusText: 'Upcoming Fixture',
        venue: {
          id: 'venue-scraped',
          name: 'Scheduled Venue',
          city: 'City',
          country: '',
        },
        startTimeUtc: new Date().toISOString(),
        teams: {
          home: { name: homeName, code: homeName.slice(0, 3).toUpperCase() },
          away: { name: awayName, code: awayName.slice(0, 3).toUpperCase() },
        },
        isLive: false,
        isDemo: false,
        dataSource: 'cricbuzz_scraper',
      };
    });

    const limit = options.limit || fixtures.length;
    return {
      success: true,
      data: fixtures.slice(0, limit),
      metadata: this.createMetadata(),
    };
  }

  async getResults(): Promise<CricketDataResult<CricketMatch[]>> {
    return {
      success: true,
      data: [],
      metadata: this.createMetadata(),
    };
  }

  async getMatchDetails(): Promise<CricketDataResult<CricketMatch | null>> {
    return {
      success: false,
      data: null,
      metadata: this.createMetadata(),
      error: {
        code: 'NOT_FOUND',
        message: `Match details endpoint not supported by scraper microservice`,
      },
    };
  }

  async getPlayerStatistics(playerId: string): Promise<CricketDataResult<CricketPlayerProfile | null>> {
    const res = await this.request<unknown[]>(`/players/${encodeURIComponent(playerId)}`);

    if (res.error || !res.data) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: res.error,
      };
    }

    // Scraper returns: [{ "Player Name": "...", "Country": "...", "Role": "...", "Batting Career Summary 1": { ... } }]
    const raw = Array.isArray(res.data) ? res.data[0] : res.data;
    if (!raw || typeof raw !== 'object') {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: { code: 'NOT_FOUND', message: `Player statistics not found for '${playerId}'` },
      };
    }

    const rawObj = raw as Record<string, unknown>;
    const profile: CricketPlayerProfile = {
      id: playerId,
      name: String(rawObj['Player Name'] || playerId),
      country: String(rawObj['Country'] || ''),
      role: String(rawObj['Role'] || 'Player'),
      batting_stats: {},
      bowling_stats: {},
    };

    return {
      success: true,
      data: profile,
      metadata: this.createMetadata(),
    };
  }

  async getCompetitions(): Promise<CricketDataResult<CricketCompetition[]>> {
    return {
      success: true,
      data: [],
      metadata: this.createMetadata(),
    };
  }

  async getRankings(): Promise<CricketDataResult<RankingEntry[]>> {
    return {
      success: true,
      data: [],
      metadata: this.createMetadata(),
    };
  }

  async searchMatches(): Promise<CricketDataResult<CricketSearchResult>> {
    return {
      success: true,
      data: { matches: [], competitions: [], teams: [] },
      metadata: this.createMetadata(),
    };
  }
}
