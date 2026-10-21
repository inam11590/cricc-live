/**
 * Livecric Domain Schemas & Types
 * Ultra-low-latency browser-native cricket broadcast architecture
 */

export type ChannelNumber = 1 | 2 | 3 | 4 | 5 | 6;

export type MatchFormat = 'TEST' | 'ODI' | 'T20I' | 'T20_LEAGUE' | 'WOMEN_T20';

export type StreamStatus = 'LIVE' | 'INNINGS_BREAK' | 'UPCOMING' | 'STUMPS' | 'OFF_AIR';

export interface MatchScheduleBlock {
  label: string;
  venue: string;
  dateRange: string;
  startTimeUtc: string; // ISO-8601 UTC timestamp
  localStartTimeLabel: string;
}

export interface TeamInfo {
  name: string;
  code: string;
  flagEmoji: string;
  accentColor: string;
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
    home: TeamInfo;
    away: TeamInfo;
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
  downloaderCode?: string; // e.g. "565656" for Android TV Simple Downloader
}
