/**
 * CricLive Canonical Domain Schemas & Types
 * Step 2.1: Strictly typed domain architecture for professional cricket data systems
 */

import { CricketOversDetail } from '@/lib/cricketOvers';

// ==========================================
// 1. Data Sources & Metadata
// ==========================================

export type CricketDataSource =
  | 'mock'
  | 'cricbuzz_scraper'
  | 'partner_api'
  | 'authorized_feed';

export interface CricketDataMetadata {
  /** The upstream data provider source identifier */
  source: CricketDataSource;
  /** Whether the payload contains simulated or mock data fixtures */
  isDemo: boolean;
  /** Timestamp when the data was retrieved from upstream (ISO 8601) */
  fetchedAt: string;
  /** Whether this payload was served from the local cache */
  cached: boolean;
  /** Expiration timestamp for the cached payload (ISO 8601) */
  cacheExpiresAt?: string;
  /** Whether the data is considered stale based on configured live/static TTL */
  isStale: boolean;
  /** Cache key or ETag for telemetry and conditional fetching */
  etag?: string;
}

export interface CricketDataError {
  code:
    | 'PROVIDER_UNAVAILABLE'
    | 'UPSTREAM_TIMEOUT'
    | 'RATE_LIMITED'
    | 'VALIDATION_FAILED'
    | 'NOT_FOUND'
    | 'UNSUPPORTED_PROVIDER'
    | 'INTERNAL_ERROR';
  message: string;
  details?: unknown;
}

export interface CricketDataResult<T> {
  success: boolean;
  data: T;
  metadata: CricketDataMetadata;
  error?: CricketDataError;
}

// ==========================================
// 2. Canonical Match Status & Formats
// ==========================

export type MatchFormat =
  | 'TEST'
  | 'ODI'
  | 'T20'
  | 'T20I'
  | 'T20_LEAGUE'
  | 'WOMEN_T20'
  | 'FIRST_CLASS';

export type CricketMatchStatus =
  | 'SCHEDULED'
  | 'UPCOMING'
  | 'LIVE'
  | 'INNINGS_BREAK'
  | 'TEA'
  | 'LUNCH'
  | 'STUMPS'
  | 'RAIN_DELAY'
  | 'COMPLETED'
  | 'ABANDONED'
  | 'NO_RESULT';

/** Legacy alias */
export type MatchStatus = CricketMatchStatus;

// ==========================================
// 3. Teams, Venues & Competitions
// ==========================================

export interface CricketTeam {
  id?: string;
  name: string;
  shortName?: string;
  code: string;
  country?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  crestUrl?: string;
  flagEmoji?: string;
}

/** Legacy alias */
export type TeamInfo = CricketTeam;

export interface CricketVenue {
  id: string;
  name: string;
  city: string;
  country: string;
  capacity?: number;
  pitchType?: string;
}

/** Legacy alias */
export type VenueInfo = CricketVenue;

export interface CricketCompetition {
  id: string;
  name: string;
  shortName: string;
  season: string;
  format: MatchFormat;
  category: 'INTERNATIONAL' | 'LEAGUE' | 'DOMESTIC';
  teamsCount: number;
  startDate: string;
  endDate: string;
  trophyHolder?: string;
  status: 'ONGOING' | 'UPCOMING' | 'COMPLETED';
}

/** Legacy alias */
export type Competition = CricketCompetition;

// ==========================================
// 4. Innings, Batting, Bowling & Scorecard
// ==========================================

export interface CricketBattingScore {
  playerId: string;
  name: string;
  role?: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  dismissal?: string;
  isNotOut: boolean;
  isCurrentStriker?: boolean;
  isCurrentNonStriker?: boolean;
}

/** Legacy alias */
export type BatterScore = CricketBattingScore;

export interface CricketBowlingFigures {
  playerId: string;
  name: string;
  overs: number; // Decimal cricket representation e.g. 10.0 or 4.2
  oversDetail?: CricketOversDetail;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
  isCurrentBowler?: boolean;
}

/** Legacy alias */
export type BowlerScore = CricketBowlingFigures;

export interface FallOfWicket {
  wicketNumber: number;
  score: number;
  overs: number;
  playerOut: string;
}

export interface CricketPartnership {
  wicket: number; // e.g. 1 for 1st wicket, 2 for 2nd wicket
  runs: number;
  balls: number;
  overs?: string | number;
  batter1: {
    name: string;
    runs: number;
    balls: number;
  };
  batter2: {
    name: string;
    runs: number;
    balls: number;
  };
}

export interface PlayingConditions {
  matchType?: string;
  ballsPerOver?: number; // default 6
  pitchCondition?: string;
  weatherCondition?: string;
  floodlights?: boolean;
}

export interface CricketInningsExtras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  total: number;
}

export interface CricketInnings {
  inningsNumber: 1 | 2;
  battingTeamId: string;
  bowlingTeamId: string;
  runs: number;
  wickets: number;
  overs: number; // e.g. 50.0 or 41.2
  oversDetail?: CricketOversDetail;
  declared?: boolean;
  isAllOut?: boolean;
  isSuperOver?: boolean;
  batters: CricketBattingScore[];
  bowlers: CricketBowlingFigures[];
  extras: CricketInningsExtras;
  fallOfWickets?: FallOfWicket[];
  partnerships?: CricketPartnership[];
}

/** Legacy alias */
export type InningsDetail = CricketInnings;

export interface TeamInningsScore {
  teamId: string;
  inningsNumber: 1 | 2;
  runs: number;
  wickets: number;
  overs: number;
  balls?: number;
  declared?: boolean;
  isCurrentInnings?: boolean;
  runRate?: number;
}

export interface CommentaryBall {
  id: string;
  over: number;
  ball: number;
  runs: number;
  isWicket: boolean;
  isBoundary: boolean;
  boundaryType?: 'FOUR' | 'SIX';
  eventDescription: string;
  commentaryText: string;
  bowlerName: string;
  batterName: string;
  timestamp: string;
}

export interface MatchOfficials {
  umpires?: string[];
  thirdUmpire?: string;
  matchReferee?: string;
}

// ==========================================
// 5. Canonical Cricket Match
// ==========================================

export interface CricketMatch {
  id: string;
  slug: string;
  title: string;
  shortTitle: string;
  competition: string;
  seriesId?: string;
  format: MatchFormat;
  status: CricketMatchStatus;
  statusText: string;
  venue: CricketVenue;
  startTimeUtc: string; // ISO 8601
  endTimeUtc?: string;
  teams: {
    home: CricketTeam;
    away: CricketTeam;
  };
  scores?: {
    home: TeamInningsScore[];
    away: TeamInningsScore[];
  };
  currentInnings?: number;
  currentBattingTeamId?: string;
  target?: number;
  requiredRunRate?: number;
  currentRunRate?: number;
  isFeatured?: boolean;
  isLive?: boolean;
  isDemo: boolean;
  lastUpdatedUtc?: string;
  dataSource?: CricketDataSource;
  scorecard?: {
    innings: CricketInnings[];
    commentary?: CommentaryBall[];
    officials?: MatchOfficials;
    playingConditions?: PlayingConditions;
    toss?: string;
    playerOfTheMatch?: string;
    matchSummary?: string;
  };
}

// ==========================================
// 6. Player Statistics & Profiles
// ==========================================

export interface BattingCareerSummary {
  matches: string;
  runs: string;
  highest_score: string;
  average: string;
  strike_rate: string;
  hundreds: string;
  fifties: string;
}

export interface BowlingCareerSummary {
  balls: string;
  runs: string;
  wickets: string;
  best_bowling_innings: string;
  economy: string;
  five_wickets: string;
}

export interface CricketPlayerProfile {
  id: string;
  name: string;
  country: string;
  image?: string;
  role: string;
  battingStyle?: string;
  bowlingStyle?: string;
  rankings?: {
    batting: { test: string; odi: string; t20: string };
    bowling: { test: string; odi: string; t20: string };
  };
  batting_stats: Record<string, BattingCareerSummary>;
  bowling_stats: Record<string, BowlingCareerSummary>;
}

// ==========================================
// 7. Rankings & Editorial Models
// ==========================================

export interface RankingEntry {
  rank: number;
  name: string;
  teamCode: string;
  country: string;
  rating: number;
  points?: number;
  rankChange?: number;
}

export interface EditorialArticle {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: 'ANALYSIS' | 'MATCH_REPORT' | 'PREVIEW' | 'INTERVIEW';
  format?: MatchFormat;
  publishedAt: string;
  author: string;
  readingTimeMinutes: number;
  tags: string[];
}

// ==========================================
// 8. Legacy Broadcast Fixture Compatibility
// ==========================================

export type ChannelNumber = 1 | 2 | 3 | 4 | 5 | 6;
export type StreamStatus = 'LIVE' | 'INNINGS_BREAK' | 'UPCOMING' | 'STUMPS' | 'OFF_AIR';

export interface MatchScheduleBlock {
  label: string;
  venue: string;
  dateRange: string;
  startTimeUtc: string;
  localStartTimeLabel: string;
}

export interface StreamSource {
  id: string;
  label: string;
  embedUrl: string;
  type: 'IFRAME' | 'HLS';
  priority: number;
}

export interface CricketChannelFixture {
  id: string;
  slug: string;
  channelNumber: ChannelNumber;
  title: string;
  shortTitle: string;
  competition: string;
  format: MatchFormat;
  status: StreamStatus;
  teams: {
    home: CricketTeam;
    away: CricketTeam;
  };
  streamSources: StreamSource[];
  editorialSummary: string;
  scheduleBlocks: MatchScheduleBlock[];
}

export type PlatformId = 'android' | 'iphone' | 'android-tv' | 'smart-tv';

export interface PlatformGuide {
  platformId: PlatformId;
  title: string;
  badge: string;
  shortInstruction: string;
  downloaderCode?: string;
}
