/**
 * CricLive Authorized Partner Cricket Data Provider
 * 
 * Production adapter for an authenticated, authorized cricket data feed / REST API.
 * 
 * SECURITY & ARCHITECTURE GUARANTEES:
 * - Credentials read strictly from server-side environment variables (CRICLIVE_PARTNER_API_KEY).
 * - Zero exposure of API keys to client bundles or browser logs.
 * - Enforces configurable HTTP timeouts with AbortController.
 * - Handles HTTP 429 rate-limiting, 401/403 auth failures, and 5xx upstream outages.
 * - Normalizes external payloads into canonical CricLive domain types.
 * - Strictly labels verified data with metadata.isDemo = false.
 */

import {
  CricketMatch,
  CricketCompetition,
  CricketPlayerProfile,
  RankingEntry,
  MatchFormat,
  CricketMatchStatus,
  CricketDataResult,
  CricketDataMetadata,
  CricketDataError,
} from '@/types/cricket';
import {
  CricketDataProvider,
  FixtureFilterOptions,
  ResultFilterOptions,
  CricketSearchResult,
} from './types';
import { parseCricketOvers } from '@/lib/cricketOvers';
import { ProviderConfigurationError } from './factory';
import { getAppConfig } from '@/lib/config/env';

export interface PartnerProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeoutMs?: number;
  maxRetries?: number;
  retryDelayMs?: number;
  fetchFn?: typeof fetch;
}

// Upstream payload interfaces based on standard sports data REST contracts
export interface UpstreamTeamPayload {
  id?: string | number;
  name: string;
  code?: string;
  country?: string;
  crest_url?: string;
}

export interface UpstreamInningsScorePayload {
  team_id?: string | number;
  innings_number?: number;
  runs?: number;
  wickets?: number;
  overs?: number | string;
  is_declared?: boolean;
}

export interface UpstreamBatterScorePayload {
  player_id?: string | number;
  name?: string;
  role?: string;
  runs?: number;
  balls?: number;
  fours?: number;
  sixes?: number;
  strike_rate?: number;
  dismissal?: string;
  is_not_out?: boolean;
  is_current_striker?: boolean;
  is_current_non_striker?: boolean;
}

export interface UpstreamBowlerScorePayload {
  player_id?: string | number;
  name?: string;
  overs?: number | string;
  maidens?: number;
  runs?: number;
  wickets?: number;
  economy?: number;
  is_current_bowler?: boolean;
}

export interface UpstreamInningsPayload {
  innings_number?: number;
  batting_team_id?: string | number;
  bowling_team_id?: string | number;
  runs?: number;
  wickets?: number;
  overs?: number | string;
  is_declared?: boolean;
  is_all_out?: boolean;
  is_super_over?: boolean;
  batters?: UpstreamBatterScorePayload[];
  bowlers?: UpstreamBowlerScorePayload[];
  extras?: {
    wides?: number;
    no_balls?: number;
    byes?: number;
    leg_byes?: number;
    total?: number;
  };
  fall_of_wickets?: Array<{
    wicket_number?: number;
    score?: number;
    overs?: number | string;
    player_out?: string;
  }>;
  partnerships?: Array<{
    wicket?: number;
    runs?: number;
    balls?: number;
    overs?: string | number;
    batter1?: { name?: string; runs?: number; balls?: number };
    batter2?: { name?: string; runs?: number; balls?: number };
  }>;
}

export interface UpstreamScorecardPayload {
  innings?: UpstreamInningsPayload[];
  toss?: string;
  player_of_the_match?: string;
  match_summary?: string;
  playing_conditions?: {
    match_type?: string;
    balls_per_over?: number;
    pitch_condition?: string;
    weather_condition?: string;
    floodlights?: boolean;
  };
  officials?: {
    umpires?: string[];
    third_umpire?: string;
    match_referee?: string;
  };
}

export interface UpstreamMatchPayload {
  id: string | number;
  title?: string;
  short_title?: string;
  competition?: string;
  series_id?: string | number;
  format?: string;
  status?: string;
  status_text?: string;
  starts_at?: string;
  ends_at?: string;
  venue?: {
    id?: string | number;
    name?: string;
    city?: string;
    country?: string;
    capacity?: number;
  };
  teams?: {
    home?: UpstreamTeamPayload;
    away?: UpstreamTeamPayload;
  };
  scores?: {
    home?: UpstreamInningsScorePayload[];
    away?: UpstreamInningsScorePayload[];
  };
  target?: number;
  required_run_rate?: number;
  current_run_rate?: number;
  scorecard?: UpstreamScorecardPayload;
}

export class AuthorizedPartnerProvider implements CricketDataProvider {
  readonly id = 'partner_api';
  private apiKey: string;
  private baseUrl: string;
  private timeoutMs: number;
  private maxRetries: number;
  private retryDelayMs: number;
  private fetchFn: typeof fetch;

  constructor(config: PartnerProviderConfig = {}) {
    const appConfig = getAppConfig();
    this.apiKey = config.apiKey !== undefined ? config.apiKey : appConfig.partnerApiKey;
    this.baseUrl = (config.baseUrl || appConfig.partnerBaseUrl).replace(/\/+$/, '');
    this.timeoutMs = config.timeoutMs ?? appConfig.httpTimeoutMs;
    this.maxRetries = config.maxRetries ?? 1;
    this.retryDelayMs = config.retryDelayMs ?? 100;
    this.fetchFn = config.fetchFn || globalThis.fetch;

    // Fail immediately if instantiated without required credentials
    if (!this.apiKey) {
      throw new ProviderConfigurationError(
        'CRICLIVE_PARTNER_API_KEY is required to initialize AuthorizedPartnerProvider. Please set this server-side environment variable or switch CRICLIVE_DATA_PROVIDER to "mock".'
      );
    }
  }

  private createMetadata(isCached = false): CricketDataMetadata {
    return {
      source: 'partner_api',
      isDemo: false,
      fetchedAt: new Date().toISOString(),
      cached: isCached,
      isStale: false,
    };
  }

  /**
   * Internal secure request dispatcher with timeout, sanitized headers, rate-limit handling,
   * bounded retries for transient 5xx errors, and path sanitization.
   */
  private async request<T>(endpoint: string): Promise<{ data?: T; error?: CricketDataError }> {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    // Sanitize path against traversal
    const sanitizedEndpoint = cleanEndpoint.replace(/\.\./g, '');
    const url = `${this.baseUrl}${sanitizedEndpoint}`;

    let lastError: CricketDataError | null = null;
    const maxAttempts = 1 + Math.max(0, this.maxRetries);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutHandle = setTimeout(() => controller.abort(), this.timeoutMs);

      try {
        const response = await this.fetchFn(url, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'x-api-key': this.apiKey,
            'User-Agent': 'CricLive-Engine/2.2',
          },
          signal: controller.signal,
        });

        clearTimeout(timeoutHandle);

        if (response.status === 401 || response.status === 403) {
          // Authentication errors are non-transient, fail immediately
          return {
            error: {
              code: 'PROVIDER_UNAVAILABLE',
              message: 'Authentication failure with upstream cricket provider',
            },
          };
        }

        if (response.status === 429) {
          const retryAfter = response.headers.get('retry-after');
          return {
            error: {
              code: 'RATE_LIMITED',
              message: `Upstream cricket provider rate limit exceeded${
                retryAfter ? `. Retry after ${retryAfter}s` : ''
              }`,
              details: { retryAfter },
            },
          };
        }

        // Bounded retry for transient 5xx server errors
        if (response.status >= 500 && attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, this.retryDelayMs * attempt));
          continue;
        }

        if (!response.ok) {
          return {
            error: {
              code: 'PROVIDER_UNAVAILABLE',
              message: `Upstream cricket provider responded with status ${response.status}`,
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
              message: `Request to upstream cricket provider timed out after ${this.timeoutMs}ms`,
            },
          };
        }

        // Bounded retry for transient connection drop
        if (attempt < maxAttempts) {
          await new Promise((r) => setTimeout(r, this.retryDelayMs * attempt));
          continue;
        }

        lastError = {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Network communication failure with upstream cricket provider',
        };
      }
    }

    return {
      error: lastError || {
        code: 'PROVIDER_UNAVAILABLE',
        message: 'Network communication failure with upstream cricket provider',
      },
    };
  }

  // ==========================================
  // Data Normalization Helpers
  // ==========================================

  private normalizeFormat(raw?: string): MatchFormat {
    if (!raw) return 'T20';
    const upper = raw.toUpperCase().trim();
    if (upper.includes('TEST')) return 'TEST';
    if (upper.includes('ODI')) return 'ODI';
    if (upper.includes('T20I')) return 'T20I';
    if (upper.includes('LEAGUE') || upper.includes('IPL') || upper.includes('BBL')) return 'T20_LEAGUE';
    if (upper.includes('WOMEN')) return 'WOMEN_T20';
    return 'T20';
  }

  private normalizeStatus(raw?: string): CricketMatchStatus {
    if (!raw) return 'SCHEDULED';
    const upper = raw.toUpperCase().trim();
    if (upper === 'LIVE' || upper === 'IN_PROGRESS' || upper === 'ACTIVE') return 'LIVE';
    if (upper.includes('BREAK') || upper.includes('INNINGS')) return 'INNINGS_BREAK';
    if (upper.includes('STUMP')) return 'STUMPS';
    if (upper.includes('TEA')) return 'TEA';
    if (upper.includes('LUNCH')) return 'LUNCH';
    if (upper.includes('RAIN') || upper.includes('DELAY')) return 'RAIN_DELAY';
    if (upper === 'COMPLETED' || upper === 'FINISHED' || upper === 'ENDED') return 'COMPLETED';
    if (upper.includes('ABANDON')) return 'ABANDONED';
    if (upper.includes('NO RESULT')) return 'NO_RESULT';
    return 'SCHEDULED';
  }

  private normalizeMatch(raw: UpstreamMatchPayload): CricketMatch {
    const format = this.normalizeFormat(raw.format);
    const status = this.normalizeStatus(raw.status);
    const id = String(raw.id);

    const homeTeamName = raw.teams?.home?.name || 'Home Team';
    const homeTeamCode = raw.teams?.home?.code || homeTeamName.substring(0, 3).toUpperCase();
    const awayTeamName = raw.teams?.away?.name || 'Away Team';
    const awayTeamCode = raw.teams?.away?.code || awayTeamName.substring(0, 3).toUpperCase();

    const shortTitle = `${homeTeamCode} vs ${awayTeamCode}`;
    const title = raw.title || `${homeTeamName} vs ${awayTeamName}, ${format}`;

    const homeScores = (raw.scores?.home || []).map((s, idx) => {
      const parsedOvers = parseCricketOvers(s.overs);
      return {
        teamId: String(raw.teams?.home?.id || 'home'),
        inningsNumber: (idx === 0 ? 1 : 2) as 1 | 2,
        runs: s.runs || 0,
        wickets: s.wickets || 0,
        overs: parsedOvers.asFloat,
        balls: parsedOvers.totalBalls,
        declared: s.is_declared,
      };
    });

    const awayScores = (raw.scores?.away || []).map((s, idx) => {
      const parsedOvers = parseCricketOvers(s.overs);
      return {
        teamId: String(raw.teams?.away?.id || 'away'),
        inningsNumber: (idx === 0 ? 1 : 2) as 1 | 2,
        runs: s.runs || 0,
        wickets: s.wickets || 0,
        overs: parsedOvers.asFloat,
        balls: parsedOvers.totalBalls,
        declared: s.is_declared,
      };
    });

    return {
      id,
      slug: `match-${id}`,
      title,
      shortTitle,
      competition: raw.competition || 'International Tour',
      seriesId: raw.series_id ? String(raw.series_id) : undefined,
      format,
      status,
      statusText: raw.status_text || (status === 'LIVE' ? 'Match In Progress' : 'Scheduled'),
      venue: {
        id: String(raw.venue?.id || 'venue-default'),
        name: raw.venue?.name || 'International Cricket Stadium',
        city: raw.venue?.city || 'Host City',
        country: raw.venue?.country || '',
        capacity: raw.venue?.capacity,
      },
      startTimeUtc: raw.starts_at || new Date().toISOString(),
      endTimeUtc: raw.ends_at,
      teams: {
        home: {
          id: String(raw.teams?.home?.id || 'home'),
          name: homeTeamName,
          code: homeTeamCode,
          country: raw.teams?.home?.country,
          crestUrl: raw.teams?.home?.crest_url,
        },
        away: {
          id: String(raw.teams?.away?.id || 'away'),
          name: awayTeamName,
          code: awayTeamCode,
          country: raw.teams?.away?.country,
          crestUrl: raw.teams?.away?.crest_url,
        },
      },
      scores: {
        home: homeScores,
        away: awayScores,
      },
      target: raw.target,
      requiredRunRate: raw.required_run_rate,
      currentRunRate: raw.current_run_rate,
      isFeatured: false,
      isLive: status === 'LIVE' || status === 'INNINGS_BREAK' || status === 'STUMPS',
      isDemo: false,
      dataSource: 'partner_api',
      lastUpdatedUtc: new Date().toISOString(),
      scorecard: this.normalizeScorecard(raw.scorecard),
    };
  }

  private normalizeScorecard(raw?: UpstreamScorecardPayload) {
    if (!raw) return undefined;

    return {
      innings: (raw.innings || []).map((inn, innIdx) => {
        const parsedOvers = parseCricketOvers(inn.overs);
        const inningsNumber = ((inn.innings_number || innIdx + 1) % 2 === 0 ? 2 : 1) as 1 | 2;

        return {
          inningsNumber,
          battingTeamId: String(inn.batting_team_id || ''),
          bowlingTeamId: String(inn.bowling_team_id || ''),
          runs: inn.runs || 0,
          wickets: inn.wickets || 0,
          overs: parsedOvers.asFloat,
          oversDetail: parsedOvers,
          declared: inn.is_declared,
          isAllOut: inn.is_all_out ?? ((inn.wickets || 0) >= 10),
          isSuperOver: inn.is_super_over,
          batters: (inn.batters || []).map((b, bIdx) => {
            const bRuns = b.runs || 0;
            const bBalls = b.balls || 0;
            const calculatedSr = bBalls > 0 ? Math.round((bRuns / bBalls) * 10000) / 100 : 0;
            return {
              playerId: String(b.player_id || `p-${innIdx}-${bIdx}`),
              name: b.name || 'Unnamed Batter',
              role: b.role,
              runs: bRuns,
              balls: bBalls,
              fours: b.fours || 0,
              sixes: b.sixes || 0,
              strikeRate: b.strike_rate ?? calculatedSr,
              dismissal: b.dismissal,
              isNotOut: Boolean(b.is_not_out),
              isCurrentStriker: b.is_current_striker,
              isCurrentNonStriker: b.is_current_non_striker,
            };
          }),
          bowlers: (inn.bowlers || []).map((bw, bwIdx) => {
            const bwOvers = parseCricketOvers(bw.overs);
            const bwRuns = bw.runs || 0;
            const calculatedEcon =
              bwOvers.totalBalls > 0
                ? Math.round(((bwRuns * 6) / bwOvers.totalBalls) * 100) / 100
                : 0;

            return {
              playerId: String(bw.player_id || `bw-${innIdx}-${bwIdx}`),
              name: bw.name || 'Unnamed Bowler',
              overs: bwOvers.asFloat,
              oversDetail: bwOvers,
              maidens: bw.maidens || 0,
              runs: bwRuns,
              wickets: bw.wickets || 0,
              economy: bw.economy ?? calculatedEcon,
              isCurrentBowler: bw.is_current_bowler,
            };
          }),
          extras: {
            wides: inn.extras?.wides || 0,
            noBalls: inn.extras?.no_balls || 0,
            byes: inn.extras?.byes || 0,
            legByes: inn.extras?.leg_byes || 0,
            total:
              inn.extras?.total ??
              ((inn.extras?.wides || 0) +
                (inn.extras?.no_balls || 0) +
                (inn.extras?.byes || 0) +
                (inn.extras?.leg_byes || 0)),
          },
          fallOfWickets: (inn.fall_of_wickets || []).map((f, fIdx) => ({
            wicketNumber: f.wicket_number || fIdx + 1,
            score: f.score || 0,
            overs: parseCricketOvers(f.overs).asFloat,
            playerOut: f.player_out || `Wicket ${f.wicket_number || fIdx + 1}`,
          })),
          partnerships: (inn.partnerships || []).map((p, pIdx) => ({
            wicket: p.wicket || pIdx + 1,
            runs: p.runs || 0,
            balls: p.balls || 0,
            overs: p.overs ? parseCricketOvers(p.overs).formatted : undefined,
            batter1: {
              name: p.batter1?.name || 'Batter 1',
              runs: p.batter1?.runs || 0,
              balls: p.batter1?.balls || 0,
            },
            batter2: {
              name: p.batter2?.name || 'Batter 2',
              runs: p.batter2?.runs || 0,
              balls: p.batter2?.balls || 0,
            },
          })),
        };
      }),
      toss: raw.toss,
      playerOfTheMatch: raw.player_of_the_match,
      matchSummary: raw.match_summary,
      playingConditions: raw.playing_conditions
        ? {
            matchType: raw.playing_conditions.match_type,
            ballsPerOver: raw.playing_conditions.balls_per_over,
            pitchCondition: raw.playing_conditions.pitch_condition,
            weatherCondition: raw.playing_conditions.weather_condition,
            floodlights: raw.playing_conditions.floodlights,
          }
        : undefined,
      officials: raw.officials
        ? {
            umpires: raw.officials.umpires,
            thirdUmpire: raw.officials.third_umpire,
            matchReferee: raw.officials.match_referee,
          }
        : undefined,
    };
  }

  // ==========================================
  // CricketDataProvider Implementation
  // ==========================================

  async getLiveMatches(): Promise<CricketDataResult<CricketMatch[]>> {
    const res = await this.request<{ matches?: UpstreamMatchPayload[] }>('/matches/live');

    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error || {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Failed to retrieve live matches from partner API',
        },
      };
    }

    const matchesList = Array.isArray(res.data) ? res.data : res.data.matches || [];
    const normalized = matchesList.map((m) => this.normalizeMatch(m));

    return {
      success: true,
      data: normalized,
      metadata: this.createMetadata(),
    };
  }

  async getFixtures(options: FixtureFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    const params = new URLSearchParams();
    if (options.format && options.format !== 'ALL') params.append('format', options.format);
    if (options.seriesId) params.append('series_id', options.seriesId);
    if (options.limit) params.append('limit', String(options.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ matches?: UpstreamMatchPayload[] }>(`/matches/fixtures${query}`);

    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error || {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Failed to retrieve fixtures from partner API',
        },
      };
    }

    const matchesList = Array.isArray(res.data) ? res.data : res.data.matches || [];
    const normalized = matchesList.map((m) => this.normalizeMatch(m));

    return {
      success: true,
      data: normalized,
      metadata: this.createMetadata(),
    };
  }

  async getResults(options: ResultFilterOptions = {}): Promise<CricketDataResult<CricketMatch[]>> {
    const params = new URLSearchParams();
    if (options.format && options.format !== 'ALL') params.append('format', options.format);
    if (options.seriesId) params.append('series_id', options.seriesId);
    if (options.limit) params.append('limit', String(options.limit));

    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ matches?: UpstreamMatchPayload[] }>(`/matches/results${query}`);

    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error || {
          code: 'PROVIDER_UNAVAILABLE',
          message: 'Failed to retrieve results from partner API',
        },
      };
    }

    const matchesList = Array.isArray(res.data) ? res.data : res.data.matches || [];
    const normalized = matchesList.map((m) => this.normalizeMatch(m));

    return {
      success: true,
      data: normalized,
      metadata: this.createMetadata(),
    };
  }

  async getMatchDetails(matchId: string): Promise<CricketDataResult<CricketMatch | null>> {
    const res = await this.request<UpstreamMatchPayload>(`/matches/${encodeURIComponent(matchId)}`);

    if (res.error || !res.data) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: res.error || {
          code: 'NOT_FOUND',
          message: `Match ${matchId} not found in partner API`,
        },
      };
    }

    return {
      success: true,
      data: this.normalizeMatch(res.data),
      metadata: this.createMetadata(),
    };
  }

  async getPlayerStatistics(playerId: string): Promise<CricketDataResult<CricketPlayerProfile | null>> {
    const res = await this.request<CricketPlayerProfile>(`/players/${encodeURIComponent(playerId)}`);

    if (res.error || !res.data) {
      return {
        success: false,
        data: null,
        metadata: this.createMetadata(),
        error: res.error || {
          code: 'NOT_FOUND',
          message: `Player statistics not found for '${playerId}' in partner API`,
        },
      };
    }

    return {
      success: true,
      data: res.data,
      metadata: this.createMetadata(),
    };
  }

  async getCompetitions(): Promise<CricketDataResult<CricketCompetition[]>> {
    const res = await this.request<CricketCompetition[]>('/competitions');
    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error,
      };
    }
    return {
      success: true,
      data: res.data,
      metadata: this.createMetadata(),
    };
  }

  async getRankings(
    category: 'teams' | 'batting' | 'bowling',
    format: 'TEST' | 'ODI' | 'T20I'
  ): Promise<CricketDataResult<RankingEntry[]>> {
    const res = await this.request<RankingEntry[]>(
      `/rankings?category=${encodeURIComponent(category)}&format=${encodeURIComponent(format)}`
    );
    if (res.error || !res.data) {
      return {
        success: false,
        data: [],
        metadata: this.createMetadata(),
        error: res.error,
      };
    }
    return {
      success: true,
      data: res.data,
      metadata: this.createMetadata(),
    };
  }

  async searchMatches(query: string): Promise<CricketDataResult<CricketSearchResult>> {
    const res = await this.request<CricketSearchResult>(`/search?q=${encodeURIComponent(query)}`);
    if (res.error || !res.data) {
      return {
        success: true,
        data: { matches: [], competitions: [], teams: [] },
        metadata: this.createMetadata(),
      };
    }
    return {
      success: true,
      data: res.data,
      metadata: this.createMetadata(),
    };
  }
}
