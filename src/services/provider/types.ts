/**
 * CricLive CricketDataProvider Contract & Provider Types
 * 
 * Formal contract for all cricket data sources (Mock provider, future authorized partner API, etc.)
 */

import {
  CricketMatch,
  CricketCompetition,
  CricketPlayerProfile,
  RankingEntry,
  MatchFormat,
  CricketDataResult,
} from '@/types/cricket';

export interface FixtureFilterOptions {
  format?: MatchFormat | 'ALL';
  seriesId?: string;
  limit?: number;
}

export interface ResultFilterOptions {
  format?: MatchFormat | 'ALL';
  seriesId?: string;
  limit?: number;
}

export interface MatchFilterOptions {
  status?: 'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED';
  format?: 'ALL' | MatchFormat;
  seriesId?: string;
  searchQuery?: string;
  limit?: number;
}

export interface CricketSearchResult {
  matches: CricketMatch[];
  competitions: CricketCompetition[];
  teams: Array<{ name: string; code: string; country: string }>;
}

export interface CricketDataProvider {
  /** Identifier of the provider */
  readonly id: string;

  /** Retrieves currently active live matches with real-time status and live scores */
  getLiveMatches(): Promise<CricketDataResult<CricketMatch[]>>;

  /** Retrieves upcoming scheduled cricket fixtures */
  getFixtures(options?: FixtureFilterOptions): Promise<CricketDataResult<CricketMatch[]>>;

  /** Retrieves recently concluded match results with final outcomes */
  getResults(options?: ResultFilterOptions): Promise<CricketDataResult<CricketMatch[]>>;

  /** Retrieves comprehensive scorecard and details for a specific match ID or slug */
  getMatchDetails(matchId: string): Promise<CricketDataResult<CricketMatch | null>>;

  /** Retrieves player biographical profile and career batting/bowling statistics */
  getPlayerStatistics(playerId: string): Promise<CricketDataResult<CricketPlayerProfile | null>>;

  /** Retrieves active tournaments and series */
  getCompetitions(): Promise<CricketDataResult<CricketCompetition[]>>;

  /** Retrieves official ICC rankings by category and format */
  getRankings(
    category: 'teams' | 'batting' | 'bowling',
    format: 'TEST' | 'ODI' | 'T20I'
  ): Promise<CricketDataResult<RankingEntry[]>>;

  /** Searches across matches, tournaments, and team rosters */
  searchMatches(query: string): Promise<CricketDataResult<CricketSearchResult>>;
}
