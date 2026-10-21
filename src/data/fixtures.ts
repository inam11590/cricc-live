import { CricketChannelFixture, PlatformGuide } from '@/types/cricket';

export const CRICKET_FIXTURES: CricketChannelFixture[] = [
  {
    id: 'ch-1',
    slug: 'india-vs-west-indies-live-in-browser',
    channelNumber: 1,
    title: 'India vs West Indies',
    shortTitle: 'IND v WI',
    competition: 'India Tour of West Indies & USA 2026',
    format: 'T20I',
    status: 'LIVE',
    teams: {
      home: {
        name: 'West Indies',
        code: 'WI',
        flagEmoji: '🌴',
        accentColor: '#800020',
      },
      away: {
        name: 'India',
        code: 'IND',
        flagEmoji: '🇮🇳',
        accentColor: '#1E40AF',
      },
    },
    streamSources: [
      {
        id: 'ind-wi-srv1',
        label: 'Global CDN Ultra-Low Latency (1080p 50fps)',
        embedUrl: 'https://stream.livecric.is/live/ch1_ind_wi/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'ind-wi-srv2',
        label: 'Direct Cloud Transponder (720p 60fps)',
        embedUrl: 'https://transponder.livecric.is/embed/ind-wi-ch1',
        type: 'IFRAME',
        priority: 2,
      },
      {
        id: 'ind-wi-srv3',
        label: 'Mobile Low-Bandwidth Edge (360p Adaptive)',
        embedUrl: 'https://stream.livecric.is/live/ch1_ind_wi_mobile/index.m3u8',
        type: 'HLS',
        priority: 3,
      },
    ],
    editorialSummary:
      'High-voltage Caribbean clash featuring explosive power-hitting from both sides. West Indies host India in an edge-of-the-seat white-ball contest broadcast live with pristine multi-angle feeds and zero satellite delay.',
    scheduleBlocks: [
      {
        label: '1st T20I',
        venue: 'Kensington Oval, Bridgetown, Barbados',
        dateRange: '21 October 2026',
        startTimeUtc: '2026-10-21T18:00:00Z',
        localStartTimeLabel: '14:00 Local (AST)',
      },
      {
        label: '2nd T20I',
        venue: 'Providence Stadium, Georgetown, Guyana',
        dateRange: '23 October 2026',
        startTimeUtc: '2026-10-23T18:00:00Z',
        localStartTimeLabel: '14:00 Local (GYT)',
      },
      {
        label: '3rd T20I',
        venue: 'Central Broward Regional Park, Lauderhill, Florida',
        dateRange: '26 October 2026',
        startTimeUtc: '2026-10-26T14:30:00Z',
        localStartTimeLabel: '10:30 Local (EDT)',
      },
    ],
  },
  {
    id: 'ch-2',
    slug: 'pakistan-odi-tri-series-2026-live-in-browser',
    channelNumber: 2,
    title: 'Pakistan ODI Tri-Series 2026',
    shortTitle: 'PAK v NZ',
    competition: 'Pakistan Champions Trophy Prep Tri-Series 2026',
    format: 'ODI',
    status: 'LIVE',
    teams: {
      home: {
        name: 'Pakistan',
        code: 'PAK',
        flagEmoji: '🇵🇰',
        accentColor: '#065F46',
      },
      away: {
        name: 'New Zealand',
        code: 'NZ',
        flagEmoji: '🇳🇿',
        accentColor: '#0F172A',
      },
    },
    streamSources: [
      {
        id: 'pak-tri-srv1',
        label: 'Rawalpindi Live Feed A (1080p 50fps)',
        embedUrl: 'https://stream.livecric.is/live/ch2_pak_tri/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'pak-tri-srv2',
        label: 'Subcontinental Broadcast Mirror',
        embedUrl: 'https://transponder.livecric.is/embed/pak-tri-ch2',
        type: 'IFRAME',
        priority: 2,
      },
    ],
    editorialSummary:
      'Crucial preparation tri-series featuring Pakistan, New Zealand, and South Africa on rapid subcontinental pitches. Day-night 50-over showcase with world-class seam and spin masterclasses.',
    scheduleBlocks: [
      {
        label: '3rd ODI (PAK v NZ)',
        venue: 'Rawalpindi Cricket Stadium, Rawalpindi',
        dateRange: '21 October 2026',
        startTimeUtc: '2026-10-21T09:30:00Z',
        localStartTimeLabel: '14:30 Local (PKT)',
      },
      {
        label: '4th ODI (NZ v SA)',
        venue: 'Gaddafi Stadium, Lahore',
        dateRange: '24 October 2026',
        startTimeUtc: '2026-10-24T09:30:00Z',
        localStartTimeLabel: '14:30 Local (PKT)',
      },
      {
        label: 'Grand Final',
        venue: 'National Bank Stadium, Karachi',
        dateRange: '28 October 2026',
        startTimeUtc: '2026-10-28T09:30:00Z',
        localStartTimeLabel: '14:30 Local (PKT)',
      },
    ],
  },
  {
    id: 'ch-3',
    slug: 'australia-vs-south-africa-live-in-browser',
    channelNumber: 3,
    title: 'Australia vs South Africa',
    shortTitle: 'AUS v RSA',
    competition: 'ICC World Test Championship 2025–27',
    format: 'TEST',
    status: 'LIVE',
    teams: {
      home: {
        name: 'South Africa',
        code: 'RSA',
        flagEmoji: '🇿🇦',
        accentColor: '#047857',
      },
      away: {
        name: 'Australia',
        code: 'AUS',
        flagEmoji: '🇦🇺',
        accentColor: '#D97706',
      },
    },
    streamSources: [
      {
        id: 'aus-rsa-srv1',
        label: 'SuperSport Clean Master Feed (1080p 50fps)',
        embedUrl: 'https://stream.livecric.is/live/ch3_aus_rsa/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'aus-rsa-srv2',
        label: 'Low Latency WebCric Cloud Tunnel',
        embedUrl: 'https://transponder.livecric.is/embed/aus-rsa-ch3',
        type: 'IFRAME',
        priority: 2,
      },
    ],
    editorialSummary:
      'The ultimate heavyweight red-ball rivalry. Pat Cummins leads the World Test Champions against Temba Bavuma’s Proteas in a grueling 3-Test rubber across Durban, Gqeberha, and Cape Town with crucial WTC final points on the line.',
    scheduleBlocks: [
      {
        label: '1st Test',
        venue: 'Kingsmead, Durban',
        dateRange: '9–13 October 2026',
        startTimeUtc: '2026-10-09T07:30:00Z',
        localStartTimeLabel: '09:30 Local',
      },
      {
        label: '2nd Test',
        venue: "St George's Park, Gqeberha",
        dateRange: '18–22 October 2026',
        startTimeUtc: '2026-10-18T07:30:00Z',
        localStartTimeLabel: '09:30 Local',
      },
      {
        label: '3rd Test',
        venue: 'Newlands, Cape Town',
        dateRange: '27–31 October 2026',
        startTimeUtc: '2026-10-27T08:00:00Z',
        localStartTimeLabel: '10:00 Local',
      },
    ],
  },
  {
    id: 'ch-4',
    slug: 'tri-nation-series-in-uae-2026-live-in-browser',
    channelNumber: 4,
    title: 'Tri-Nation Series in UAE 2026',
    shortTitle: 'UAE v IRE',
    competition: 'Desert T20 Tri-Series 2026',
    format: 'T20I',
    status: 'UPCOMING',
    teams: {
      home: {
        name: 'United Arab Emirates',
        code: 'UAE',
        flagEmoji: '🇦🇪',
        accentColor: '#DC2626',
      },
      away: {
        name: 'Ireland',
        code: 'IRE',
        flagEmoji: '🇮🇪',
        accentColor: '#16A34A',
      },
    },
    streamSources: [
      {
        id: 'uae-ire-srv1',
        label: 'Dubai Sports Direct Satellite (1080p)',
        embedUrl: 'https://stream.livecric.is/live/ch4_uae_ire/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'uae-ire-srv2',
        label: 'Gulf Cloud Mirror',
        embedUrl: 'https://transponder.livecric.is/embed/uae-ire-ch4',
        type: 'IFRAME',
        priority: 2,
      },
    ],
    editorialSummary:
      'Fast-paced desert night cricket under the Dubai ring of fire floodlights. Ireland, Scotland, and the UAE clash in high-stakes T20 international fixtures with direct qualification ramifications.',
    scheduleBlocks: [
      {
        label: 'Match 4 (UAE v IRE)',
        venue: 'Dubai International Cricket Stadium, Dubai',
        dateRange: '22 October 2026',
        startTimeUtc: '2026-10-22T14:00:00Z',
        localStartTimeLabel: '18:00 Local (GST)',
      },
      {
        label: 'Match 5 (SCO v IRE)',
        venue: 'Sharjah Cricket Stadium, Sharjah',
        dateRange: '25 October 2026',
        startTimeUtc: '2026-10-25T14:00:00Z',
        localStartTimeLabel: '18:00 Local (GST)',
      },
    ],
  },
  {
    id: 'ch-5',
    slug: 'womens-big-bash-2026-live-in-browser',
    channelNumber: 5,
    title: "Women's Big Bash 2026",
    shortTitle: 'SYS v MLS',
    competition: 'WBBL|12 Championship',
    format: 'WOMEN_T20',
    status: 'LIVE',
    teams: {
      home: {
        name: 'Sydney Sixers Women',
        code: 'SYS',
        flagEmoji: '🟣',
        accentColor: '#DB2777',
      },
      away: {
        name: 'Melbourne Stars Women',
        code: 'MLS',
        flagEmoji: '🟢',
        accentColor: '#059669',
      },
    },
    streamSources: [
      {
        id: 'wbbl-srv1',
        label: 'Fox Cricket Australian Primary (1080p 50fps)',
        embedUrl: 'https://stream.livecric.is/live/ch5_wbbl/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'wbbl-srv2',
        label: 'Oceania Ultra-Speed Web Edge',
        embedUrl: 'https://transponder.livecric.is/embed/wbbl-ch5',
        type: 'IFRAME',
        priority: 2,
      },
    ],
    editorialSummary:
      'Premier women’s franchise cricket showcasing international superstars. Ellyse Perry’s Sixers battle Meg Lanning’s Stars in a festival weekend derby with electric atmosphere and world-class fielding displays.',
    scheduleBlocks: [
      {
        label: 'Sydney Derby Special',
        venue: 'North Sydney Oval, Sydney',
        dateRange: '21 October 2026',
        startTimeUtc: '2026-10-21T08:10:00Z',
        localStartTimeLabel: '19:10 Local (AEDT)',
      },
      {
        label: 'Melbourne Weekend Clash',
        venue: 'CitiPower Centre, Junction Oval, Melbourne',
        dateRange: '24 October 2026',
        startTimeUtc: '2026-10-24T03:30:00Z',
        localStartTimeLabel: '14:30 Local (AEDT)',
      },
    ],
  },
  {
    id: 'ch-6',
    slug: 'afghanistan-vs-zimbabwe-2026-live-in-browser',
    channelNumber: 6,
    title: 'Afghanistan vs Zimbabwe 2026',
    shortTitle: 'AFG v ZIM',
    competition: 'Bilateral ODI & T20I Series 2026',
    format: 'ODI',
    status: 'UPCOMING',
    teams: {
      home: {
        name: 'Zimbabwe',
        code: 'ZIM',
        flagEmoji: '🇿🇼',
        accentColor: '#DC2626',
      },
      away: {
        name: 'Afghanistan',
        code: 'AFG',
        flagEmoji: '🇦🇫',
        accentColor: '#2563EB',
      },
    },
    streamSources: [
      {
        id: 'afg-zim-srv1',
        label: 'African Satellite Uplink Master (1080p)',
        embedUrl: 'https://stream.livecric.is/live/ch6_afg_zim/index.m3u8',
        type: 'HLS',
        priority: 1,
      },
      {
        id: 'afg-zim-srv2',
        label: 'Harare Sports Web Relay',
        embedUrl: 'https://transponder.livecric.is/embed/afg-zim-ch6',
        type: 'IFRAME',
        priority: 2,
      },
    ],
    editorialSummary:
      'Thrilling limited-overs action between two passionate cricket nations. Rashid Khan’s Afghan contingent faces Sikandar Raza and the Chevrons on bouncy Harare and Bulawayo surfaces.',
    scheduleBlocks: [
      {
        label: '1st ODI',
        venue: 'Harare Sports Club, Harare',
        dateRange: '23 October 2026',
        startTimeUtc: '2026-10-23T07:30:00Z',
        localStartTimeLabel: '09:30 Local (CAT)',
      },
      {
        label: '2nd ODI',
        venue: 'Harare Sports Club, Harare',
        dateRange: '25 October 2026',
        startTimeUtc: '2026-10-25T07:30:00Z',
        localStartTimeLabel: '09:30 Local (CAT)',
      },
      {
        label: '3rd ODI',
        venue: 'Queens Sports Club, Bulawayo',
        dateRange: '28 October 2026',
        startTimeUtc: '2026-10-28T07:30:00Z',
        localStartTimeLabel: '09:30 Local (CAT)',
      },
    ],
  },
];

export const PLATFORM_GUIDES: PlatformGuide[] = [
  {
    platformId: 'android',
    title: 'Android Mobile & Tablet',
    badge: 'PWA Instant Stream',
    shortInstruction:
      'Open livecric.is in Chrome, tap the 3-dot menu and select "Install app" or "Add to Home Screen". Launches in standalone full-screen player mode with hardware accelerated HLS.',
  },
  {
    platformId: 'iphone',
    title: 'iPhone & iPad',
    badge: 'Safari Native AirPlay',
    shortInstruction:
      'Open livecric.is in Safari, tap the Share icon, and select "Add to Home Screen". Supports background audio, picture-in-picture, and zero-lag AirPlay 2 beaming to your living room.',
  },
  {
    platformId: 'android-tv',
    title: 'Android TV & Google TV',
    badge: 'Simple Downloader 565656',
    shortInstruction:
      'Launch the Downloader app on your TV box or Fire TV, input numeric quick-dial code 565656, and press Go to open Livecric in dedicated 10-foot D-pad navigation mode.',
    downloaderCode: '565656',
  },
  {
    platformId: 'smart-tv',
    title: 'Samsung Tizen & LG webOS',
    badge: 'Zero-Install Browser',
    shortInstruction:
      'Launch your television’s native Internet Browser, navigate to https://livecric.is, bookmark the channel dashboard, and stream in pure 4K/1080p using standard TV remote controls.',
  },
];

/**
 * Utility lookup helpers
 */
export function getFixtureByChannelNumber(channelNumber: number): CricketChannelFixture | undefined {
  return CRICKET_FIXTURES.find((f) => f.channelNumber === channelNumber);
}

export function getFixtureBySlug(slug: string): CricketChannelFixture | undefined {
  return CRICKET_FIXTURES.find((f) => f.slug === slug);
}
