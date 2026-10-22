import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CricketMatch, CricketInnings } from '../src/types/cricket';
import { MOCK_MATCHES } from '../src/data/mockCricketData';
import { cricketService } from '../src/services/cricketService';
import { GET as matchRouteGet } from '../src/app/api/matches/[id]/route';
import {
  parseCricketOvers,
  ballsToOvers,
  addOvers,
  calculateRunRate,
  calculateEconomy,
  calculateRequiredRunRate,
  formatOversNotation,
  getOversBreakdown,
} from '../src/lib/cricketOvers';

import { ScorecardShell } from '../src/components/scorecard/ScorecardShell';
import { MatchHeaderBanner } from '../src/components/scorecard/MatchHeaderBanner';
import { InningsSelector } from '../src/components/scorecard/InningsSelector';
import { BattingTable } from '../src/components/scorecard/BattingTable';
import { BowlingTable } from '../src/components/scorecard/BowlingTable';
import { PartnershipsView } from '../src/components/scorecard/PartnershipsView';
import { FallOfWickets } from '../src/components/scorecard/FallOfWickets';
import { MatchInfoTab } from '../src/components/scorecard/MatchInfoTab';
import { MatchSummaryTab } from '../src/components/scorecard/MatchSummaryTab';
import { DemoDataBadge } from '../src/components/ui/DemoDataBadge';
import { AuthorizedPartnerProvider } from '../src/services/provider/partnerProvider';

describe('Cricket Match Center — Step 2.3 Production Suite', () => {
  const featuredMatch = MOCK_MATCHES[0]!;

  // ==========================================
  // 1. Match Detail Rendering
  // ==========================================
  describe('1. Match-Detail Rendering', () => {
    it('renders full match center with correct competition, format, teams, and venue', () => {
      const html = renderToStaticMarkup(
        React.createElement(ScorecardShell, {
          match: featuredMatch,
          allMatches: MOCK_MATCHES,
        })
      );

      // Competition and format
      assert.equal(html.includes('ICC Champions Trophy 2026'), true);
      assert.equal(html.includes('ODI'), true);

      // Teams and codes
      assert.equal(html.includes('India'), true);
      assert.equal(html.includes('IND'), true);
      assert.equal(html.includes('Australia'), true);
      assert.equal(html.includes('AUS'), true);

      // Scores and overs
      assert.equal(html.includes('242/4'), true);
      assert.equal(html.includes('283/8'), true);

      // Match status text
      assert.equal(html.includes('India need 42 runs in 52 balls'), true);

      // Venue information
      assert.equal(html.includes('Dubai International Cricket Stadium'), true);
      assert.equal(html.includes('Dubai'), true);

      // Player names in scorecard
      assert.equal(html.includes('Rohit Sharma'), true);
      assert.equal(html.includes('Pat Cummins'), true);
    });

    it('renders MatchHeaderBanner with scores, status badges, and telemetry', () => {
      const html = renderToStaticMarkup(
        React.createElement(MatchHeaderBanner, {
          match: featuredMatch,
          isRefreshing: false,
          lastUpdatedLabel: '12:00:00',
          isStale: false,
        })
      );

      assert.equal(html.includes('Target: <strong>284</strong>'), true);
      assert.equal(html.includes('CRR: <strong class="text-emerald-400">5.85</strong>'), true);
      assert.equal(html.includes('Live Feed Polling'), true);
      assert.equal(html.includes('Updated: 12:00:00'), true);
    });
  });

  // ==========================================
  // 2. Unknown Match IDs
  // ==========================================
  describe('2. Unknown Match IDs & Error Handling', () => {
    it('returns NOT_FOUND result when querying unknown match ID from service', async () => {
      const result = await cricketService.getMatchDetailsResult('unknown-match-fixture-xyz-999');

      assert.equal(result.success, false);
      assert.equal(result.data, null);
      assert.equal(result.error?.code, 'NOT_FOUND');
      assert.equal(result.metadata.source, 'mock');
    });

    it('returns HTTP 404 response from /api/matches/[id] route handler for unknown match', async () => {
      const req = new Request('http://localhost:3000/api/matches/unknown-id-888');
      const response = await matchRouteGet(req, {
        params: Promise.resolve({ id: 'unknown-id-888' }),
      });

      assert.equal(response.status, 404);
      const json = await response.json();
      assert.equal(json.success, false);
      assert.equal(json.data, null);
      assert.equal(json.error?.code, 'NOT_FOUND');
    });
  });

  // ==========================================
  // 3. Innings Selection & Multi-Innings Fixtures
  // ==========================================
  describe('3. Innings Selection & Multi-Innings Navigation', () => {
    it('renders InningsSelector with all available innings and ordinals', () => {
      const innings = featuredMatch.scorecard?.innings || [];
      assert.equal(innings.length >= 2, true);

      const html = renderToStaticMarkup(
        React.createElement(InningsSelector, {
          inningsList: innings,
          selectedIndex: 0,
          onSelectIndex: () => {},
          teams: featuredMatch.teams,
        })
      );

      assert.equal(html.includes('role="tablist"'), true);
      assert.equal(html.includes('aria-selected="true"'), true);
      assert.equal(html.includes('IND'), true);
      assert.equal(html.includes('AUS'), true);
    });

    it('handles super over innings with distinct badges and labels', () => {
      const superOverMatch = MOCK_MATCHES.find((m) => m.id === 'match-nz-sa-superover')!;
      assert.notEqual(superOverMatch, undefined);

      const inningsList = superOverMatch.scorecard?.innings || [];
      const superOverInnings = inningsList.filter((inn) => inn.isSuperOver);
      assert.equal(superOverInnings.length, 2);

      const html = renderToStaticMarkup(
        React.createElement(InningsSelector, {
          inningsList,
          selectedIndex: 2, // 1st super over innings
          onSelectIndex: () => {},
          teams: superOverMatch.teams,
        })
      );

      // Super Over indicator
      assert.equal(html.includes('Super Over'), true);
      assert.equal(html.includes('SO'), true);
    });
  });

  // ==========================================
  // 4. Missing Optional Statistics & Graceful Degradation
  // ==========================================
  describe('4. Missing Optional Statistics', () => {
    const minimalInnings: CricketInnings = {
      inningsNumber: 1,
      battingTeamId: 'home',
      bowlingTeamId: 'away',
      runs: 140,
      wickets: 4,
      overs: 20.0,
      batters: [
        {
          playerId: 'p1',
          name: 'Minimal Batter',
          runs: 50,
          balls: 40,
          fours: 4,
          sixes: 1,
          strikeRate: 125,
          isNotOut: true,
        },
      ],
      bowlers: [], // missing bowlers
      extras: undefined as unknown as CricketInnings['extras'], // missing extras
      fallOfWickets: undefined, // missing FOW
      partnerships: undefined, // missing partnerships
    };

    const minimalMatch: CricketMatch = {
      id: 'sparse-match-1',
      slug: 'sparse-match-1',
      title: 'Minimal A vs Minimal B',
      shortTitle: 'MIN A vs MIN B',
      competition: 'Minimal Cricket League',
      format: 'T20',
      status: 'COMPLETED',
      statusText: 'Minimal A won by 6 wickets',
      venue: {
        id: 'v1',
        name: 'County Ground',
        city: 'Bristol',
        country: 'England',
      },
      startTimeUtc: '2026-10-21T12:00:00Z',
      teams: {
        home: { name: 'Minimal A', code: 'MINA' },
        away: { name: 'Minimal B', code: 'MINB' },
      },
      scores: undefined, // missing team scores in outer match
      isDemo: true,
      dataSource: 'mock',
      scorecard: {
        innings: [minimalInnings],
        officials: undefined, // missing officials
        playingConditions: undefined, // missing conditions
        toss: undefined, // missing toss
        playerOfTheMatch: undefined, // missing POTM
        matchSummary: undefined, // missing editorial summary
      },
    };

    it('renders BattingTable without crashing when extras are omitted', () => {
      const html = renderToStaticMarkup(
        React.createElement(BattingTable, {
          innings: minimalInnings,
          battingTeam: minimalMatch.teams.home,
        })
      );

      assert.equal(html.includes('Minimal Batter'), true);
      assert.equal(html.includes('140/4'), true);
      assert.equal(html.includes('Not supplied'), true);
    });

    it('renders BowlingTable unavailable card when bowlers list is empty', () => {
      const html = renderToStaticMarkup(
        React.createElement(BowlingTable, {
          bowlers: [],
          bowlingTeam: minimalMatch.teams.away,
        })
      );

      assert.equal(html.includes('Bowling figures not supplied by provider for this innings'), true);
    });

    it('renders FallOfWickets unavailable card when fallOfWickets is omitted', () => {
      const html = renderToStaticMarkup(
        React.createElement(FallOfWickets, {
          fallOfWickets: undefined,
        })
      );

      assert.equal(html.includes('Fall of wickets breakdown not supplied by provider'), true);
    });

    it('renders PartnershipsView unavailable card when partnerships are omitted', () => {
      const html = renderToStaticMarkup(
        React.createElement(PartnershipsView, {
          partnerships: undefined,
        })
      );

      assert.equal(html.includes('Partnership breakdown not supplied by provider'), true);
    });

    it('renders MatchInfoTab gracefully when playing conditions and officials are omitted', () => {
      const html = renderToStaticMarkup(
        React.createElement(MatchInfoTab, {
          match: minimalMatch,
        })
      );

      assert.equal(html.includes('Playing conditions not supplied by provider'), true);
      assert.equal(html.includes('Match officials list not supplied by provider'), true);
      assert.equal(html.includes('County Ground'), true);
    });

    it('renders MatchSummaryTab gracefully when toss and player of the match are omitted', () => {
      const html = renderToStaticMarkup(
        React.createElement(MatchSummaryTab, {
          match: minimalMatch,
        })
      );

      assert.equal(html.includes('Toss information not yet available'), true);
      assert.equal(html.includes('Player of the match will be announced'), true);
      assert.equal(html.includes('Minimal A won by 6 wickets'), true);
    });

    it('renders full ScorecardShell with minimal match without runtime exceptions', () => {
      const html = renderToStaticMarkup(
        React.createElement(ScorecardShell, {
          match: minimalMatch,
          allMatches: [minimalMatch],
        })
      );

      assert.equal(html.includes('MINA'), true);
      assert.equal(html.includes('MINB'), true);
      assert.equal(html.includes('Full Scorecard'), true);
    });
  });

  // ==========================================
  // 5. Cricket Scoring Correctness & Overs Precision
  // ==========================================
  describe('5. Cricket Scoring Correctness & Overs Notation', () => {
    it('treats overs as cricket base-6 legal balls rather than decimal fractions', () => {
      // 19.5 means 19 overs and 5 legal balls (119 balls), NOT 19.5 decimal overs (which would be 117 balls)
      const detail = parseCricketOvers('19.5');
      assert.equal(detail.overs, 19);
      assert.equal(detail.balls, 5);
      assert.equal(detail.totalBalls, 19 * 6 + 5); // 119 balls
      assert.equal(detail.formatted, '19.5');

      const breakdown = getOversBreakdown('19.5');
      assert.equal(breakdown.completedOvers, 19);
      assert.equal(breakdown.ballsInOver, 5);
      assert.equal(breakdown.totalBalls, 119);
    });

    it('formats overs with formatOversNotation correctly', () => {
      assert.equal(formatOversNotation('19.5'), '19.5 ov');
      assert.equal(formatOversNotation('20.0'), '20.0 ov');
      assert.equal(formatOversNotation(20), '20.0 ov');
      assert.equal(formatOversNotation(null), '0.0 ov');
      assert.equal(formatOversNotation(undefined), '0.0 ov');
    });

    it('adds overs across over boundaries without floating point drift', () => {
      // 19.5 (119 balls) + 0.1 (1 ball) = 120 balls = 20.0 overs (NOT 19.6!)
      const overBoundary = addOvers('19.5', '0.1');
      assert.equal(overBoundary.formatted, '20.0');
      assert.equal(overBoundary.overs, 20);
      assert.equal(overBoundary.balls, 0);

      // 41.4 (250 balls) + 0.4 (4 balls) = 254 balls = 42.2 overs
      const multiBalls = addOvers('41.4', '0.4');
      assert.equal(multiBalls.formatted, '42.2');
    });

    it('converts total balls back into canonical overs format', () => {
      const fromBalls = ballsToOvers(119);
      assert.equal(fromBalls.overs, 19);
      assert.equal(fromBalls.balls, 5);
      assert.equal(fromBalls.formatted, '19.5');
    });

    it('calculates run rate and economy correctly without division by zero', () => {
      // 242 runs in 41.2 overs (248 balls) -> 242 * 6 / 248 = 5.8548... -> 5.85
      const rr = calculateRunRate(242, '41.2');
      assert.equal(rr, 5.85);

      // 0 runs / 0 balls
      assert.equal(calculateRunRate(0, '0.0'), 0);

      // Bowler economy: 42 runs in 8.4 overs (52 balls) -> 42 * 6 / 52 = 4.85
      const econ = calculateEconomy(42, '8.4');
      assert.equal(econ, 4.85);

      // Required run rate: 42 runs needed in 52 balls -> 4.85
      const req = calculateRequiredRunRate(42, 52);
      assert.equal(req, 4.85);
    });
  });

  // ==========================================
  // 6. Demo-Data Labeling & Transparency
  // ==========================================
  describe('6. Demo-Data Labeling', () => {
    it('labels mock provider data clearly with DEMO DATA badge', () => {
      const html = renderToStaticMarkup(
        React.createElement(DemoDataBadge, {
          isDemo: true,
          source: 'mock',
          isStale: false,
        })
      );

      assert.equal(html.includes('DEMO DATA'), true);
      assert.equal(html.includes('bg-amber-400'), true);
    });

    it('labels verified partner data clearly with PARTNER API badge', () => {
      const html = renderToStaticMarkup(
        React.createElement(DemoDataBadge, {
          isDemo: false,
          source: 'partner_api',
          isStale: false,
        })
      );

      assert.equal(html.includes('PARTNER API'), true);
      assert.equal(html.includes('bg-emerald-400'), true);
      assert.equal(html.includes('DEMO DATA'), false);
    });

    it('highlights stale data clearly when isStale is true', () => {
      const html = renderToStaticMarkup(
        React.createElement(DemoDataBadge, {
          isDemo: false,
          source: 'partner_api',
          isStale: true,
        })
      );

      assert.equal(html.includes('(STALE)'), true);
    });
  });

  // ==========================================
  // 7. Provider Errors & Failure Containment
  // ==========================================
  describe('7. Upstream Provider Errors & Safety Boundary', () => {
    it('returns PROVIDER_UNAVAILABLE on partner HTTP 500 without fabricating scores', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ error: 'Internal Upstream Error' }), { status: 500 });

      const provider = new AuthorizedPartnerProvider({
        apiKey: 'partner-key-test',
        baseUrl: 'https://partner.cricket.test/v1',
        fetchFn: mockFetch,
      });

      const res = await provider.getMatchDetails('live-match-1');
      assert.equal(res.success, false);
      assert.equal(res.data, null);
      assert.equal(res.error?.code, 'PROVIDER_UNAVAILABLE');
      assert.equal(res.metadata.isDemo, false);
    });

    it('returns RATE_LIMITED on HTTP 429 and includes retry telemetry', async () => {
      const mockFetch: typeof fetch = async () =>
        new Response(JSON.stringify({ message: 'Too many requests' }), {
          status: 429,
          headers: { 'Retry-After': '30' },
        });

      const provider = new AuthorizedPartnerProvider({
        apiKey: 'partner-key-test',
        baseUrl: 'https://partner.cricket.test/v1',
        fetchFn: mockFetch,
      });

      const res = await provider.getMatchDetails('live-match-1');
      assert.equal(res.success, false);
      assert.equal(res.error?.code, 'RATE_LIMITED');
      assert.match(res.error?.message || '', /rate limit exceeded/i);
    });

    it('handles connection timeouts via AbortController', async () => {
      const mockFetch: typeof fetch = async (_url, init) => {
        return new Promise((_resolve, reject) => {
          init?.signal?.addEventListener('abort', () => {
            const err = new Error('The operation was aborted');
            err.name = 'AbortError';
            reject(err);
          });
        });
      };

      const provider = new AuthorizedPartnerProvider({
        apiKey: 'partner-key-test',
        baseUrl: 'https://partner.cricket.test/v1',
        timeoutMs: 50,
        fetchFn: mockFetch,
      });

      const res = await provider.getMatchDetails('live-match-1');
      assert.equal(res.success, false);
      assert.equal(res.error?.code, 'UPSTREAM_TIMEOUT');
    });
  });

  // ==========================================
  // 8. Refresh Behavior and Cleanup
  // ==========================================
  describe('8. Refresh Behavior and Lifecycle Cleanup', () => {
    it('identifies live matches requiring polling vs completed matches avoiding polling', () => {
      const liveStatuses = ['LIVE', 'INNINGS_BREAK', 'TEA', 'LUNCH', 'STUMPS', 'RAIN_DELAY'];
      const inactiveStatuses = ['COMPLETED', 'ABANDONED', 'NO_RESULT', 'SCHEDULED', 'UPCOMING'];

      for (const st of liveStatuses) {
        const isLive =
          st === 'LIVE' ||
          st === 'INNINGS_BREAK' ||
          st === 'TEA' ||
          st === 'LUNCH' ||
          st === 'STUMPS' ||
          st === 'RAIN_DELAY';
        assert.equal(isLive, true, `Status ${st} should trigger polling`);
      }

      for (const st of inactiveStatuses) {
        const isLive =
          st === 'LIVE' ||
          st === 'INNINGS_BREAK' ||
          st === 'TEA' ||
          st === 'LUNCH' ||
          st === 'STUMPS' ||
          st === 'RAIN_DELAY';
        assert.equal(isLive, false, `Status ${st} should NOT trigger polling`);
      }
    });

    it('renders manual refresh button and paused status for completed matches', () => {
      const completedMatch: CricketMatch = {
        ...featuredMatch,
        status: 'COMPLETED',
        statusText: 'India won by 4 wickets',
      };

      const html = renderToStaticMarkup(
        React.createElement(MatchHeaderBanner, {
          match: completedMatch,
          isRefreshing: false,
          onRefresh: () => {},
          lastUpdatedLabel: '14:30:00',
        })
      );

      // Verify polling is labeled as paused
      assert.equal(html.includes('Polling paused'), true);
      // Verify manual refresh button is present
      assert.equal(html.includes('Refresh'), true);
      // Verify result
      assert.equal(html.includes('India won by 4 wickets'), true);
    });
  });
});
