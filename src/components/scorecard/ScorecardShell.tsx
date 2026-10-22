'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { CricketMatch } from '@/types/cricket';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { MatchHeaderBanner } from './MatchHeaderBanner';
import { InningsSelector } from './InningsSelector';
import { BattingTable } from './BattingTable';
import { BowlingTable } from './BowlingTable';
import { FallOfWickets } from './FallOfWickets';
import { PartnershipsView } from './PartnershipsView';
import { MatchSummaryTab } from './MatchSummaryTab';
import { MatchInfoTab } from './MatchInfoTab';
import { MatchCommentaryTab } from './MatchCommentaryTab';
import { UpcomingMatchPreview } from './UpcomingMatchPreview';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScorecardShellProps {
  match: CricketMatch;
  allMatches?: CricketMatch[];
}

export function ScorecardShell({ match, allMatches = [] }: ScorecardShellProps) {
  const [matchData, setMatchData] = useState<CricketMatch>(match);
  const [activeTab, setActiveTab] = useState<'scorecard' | 'summary' | 'commentary' | 'info'>('scorecard');

  // Select active/current innings by default for live matches, or first innings
  const initialInningsIndex = useMemo(() => {
    const list = match.scorecard?.innings || [];
    if (list.length === 0) return 0;
    if (
      typeof match.currentInnings === 'number' &&
      match.currentInnings > 0 &&
      match.currentInnings <= list.length
    ) {
      return match.currentInnings - 1;
    }
    if (
      match.status === 'LIVE' ||
      match.status === 'INNINGS_BREAK' ||
      match.status === 'TEA' ||
      match.status === 'LUNCH' ||
      match.status === 'STUMPS' ||
      match.status === 'RAIN_DELAY'
    ) {
      return list.length - 1;
    }
    return 0;
  }, [match]);

  const [selectedInningsIndex, setSelectedInningsIndex] = useState<number>(initialInningsIndex);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  // Keep selected innings in sync with match data
  const scorecard = matchData.scorecard;
  const inningsList = scorecard?.innings || [];
  const currentInnings = inningsList[selectedInningsIndex] || inningsList[0];

  const battingTeam = useMemo(() => {
    if (!currentInnings) return matchData.teams.home;
    const bid = currentInnings.battingTeamId;
    if (matchData.teams.home.id && bid === matchData.teams.home.id) return matchData.teams.home;
    if (matchData.teams.away.id && bid === matchData.teams.away.id) return matchData.teams.away;
    if (matchData.teams.home.code && bid?.toLowerCase() === matchData.teams.home.code.toLowerCase()) {
      return matchData.teams.home;
    }
    if (matchData.teams.away.code && bid?.toLowerCase() === matchData.teams.away.code.toLowerCase()) {
      return matchData.teams.away;
    }
    if (matchData.teams.home.name && bid?.toLowerCase() === matchData.teams.home.name.toLowerCase()) {
      return matchData.teams.home;
    }
    if (matchData.teams.away.name && bid?.toLowerCase() === matchData.teams.away.name.toLowerCase()) {
      return matchData.teams.away;
    }
    return currentInnings.inningsNumber === 1 ? matchData.teams.home : matchData.teams.away;
  }, [currentInnings, matchData.teams]);

  const bowlingTeam = useMemo(() => {
    if (!currentInnings) return matchData.teams.away;
    const bwid = currentInnings.bowlingTeamId;
    if (matchData.teams.home.id && bwid === matchData.teams.home.id) return matchData.teams.home;
    if (matchData.teams.away.id && bwid === matchData.teams.away.id) return matchData.teams.away;
    if (matchData.teams.home.code && bwid?.toLowerCase() === matchData.teams.home.code.toLowerCase()) {
      return matchData.teams.home;
    }
    if (matchData.teams.away.code && bwid?.toLowerCase() === matchData.teams.away.code.toLowerCase()) {
      return matchData.teams.away;
    }
    if (matchData.teams.home.name && bwid?.toLowerCase() === matchData.teams.home.name.toLowerCase()) {
      return matchData.teams.home;
    }
    if (matchData.teams.away.name && bwid?.toLowerCase() === matchData.teams.away.name.toLowerCase()) {
      return matchData.teams.away;
    }
    return currentInnings.inningsNumber === 1 ? matchData.teams.away : matchData.teams.home;
  }, [currentInnings, matchData.teams]);

  // Refresh match details from server endpoint
  const refreshMatch = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    try {
      setIsRefreshing(true);
      const res = await fetch(`/api/matches/${encodeURIComponent(matchData.id)}`, {
        cache: 'no-store',
        signal: controller.signal,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setMatchData(json.data);
          setRefreshError(null);
          setIsStale(Boolean(json.metadata?.isStale));
          setLastRefreshedAt(new Date());
        } else if (json.error) {
          setRefreshError(json.error.message || 'Upstream provider error');
          setIsStale(true);
        }
      } else if (res.status === 429) {
        setRefreshError('Rate limit reached upstream. Displaying cached match telemetry.');
        setIsStale(true);
      } else {
        setRefreshError('Temporary communication error with match feed.');
        setIsStale(true);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setRefreshError('Request timed out refreshing match telemetry.');
      } else {
        setRefreshError('Network communication error with match feed.');
      }
      setIsStale(true);
    } finally {
      clearTimeout(timeoutId);
      setIsRefreshing(false);
    }
  }, [matchData.id]);

  // Lifecycle for polling live matches
  useEffect(() => {
    const isLive =
      matchData.status === 'LIVE' ||
      matchData.status === 'INNINGS_BREAK' ||
      matchData.status === 'TEA' ||
      matchData.status === 'LUNCH' ||
      matchData.status === 'STUMPS' ||
      matchData.status === 'RAIN_DELAY';

    if (!isLive) {
      return;
    }

    let intervalId: NodeJS.Timeout | null = null;

    const startPolling = () => {
      if (!intervalId) {
        intervalId = setInterval(() => {
          if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
            refreshMatch();
          }
        }, 20000);
      }
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        refreshMatch();
        startPolling();
      } else {
        stopPolling();
      }
    };

    startPolling();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stopPolling();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [matchData.status, refreshMatch]);

  const lastUpdatedLabel = useMemo(() => {
    try {
      return lastRefreshedAt.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
    } catch {
      return undefined;
    }
  }, [lastRefreshedAt]);

  const isUpcoming = matchData.status === 'SCHEDULED' || matchData.status === 'UPCOMING';

  const TABS = useMemo(() => ['scorecard', 'summary', 'commentary', 'info'] as const, []);

  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = TABS.indexOf(activeTab);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % TABS.length;
      setActiveTab(TABS[nextIndex]!);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + TABS.length) % TABS.length;
      setActiveTab(TABS[prevIndex]!);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveTab(TABS[0]!);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveTab(TABS[TABS.length - 1]!);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Back Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Match Center</span>
          </Link>
          <span>/</span>
          <span className="text-slate-300 font-medium">{matchData.competition}</span>
          <span>/</span>
          <span className="text-emerald-400 font-mono">{matchData.shortTitle}</span>
        </div>
      </div>

      {/* Hero Match Banner */}
      <MatchHeaderBanner
        match={matchData}
        isRefreshing={isRefreshing}
        onRefresh={refreshMatch}
        lastUpdatedLabel={lastUpdatedLabel}
        isStale={isStale}
        refreshError={refreshError}
      />

      {/* Tabs Navigation */}
      <div
        role="tablist"
        aria-label="Match Center Sections"
        onKeyDown={handleTabKeyDown}
        className="flex border-b border-white/10 gap-2 overflow-x-auto no-scrollbar"
      >
        <button
          role="tab"
          aria-selected={activeTab === 'scorecard'}
          id="tab-scorecard"
          aria-controls="panel-scorecard"
          onClick={() => setActiveTab('scorecard')}
          className={cn(
            'shrink-0 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
            activeTab === 'scorecard'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          )}
        >
          Full Scorecard
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'summary'}
          id="tab-summary"
          aria-controls="panel-summary"
          onClick={() => setActiveTab('summary')}
          className={cn(
            'shrink-0 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
            activeTab === 'summary'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          )}
        >
          Match Summary
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'commentary'}
          id="tab-commentary"
          aria-controls="panel-commentary"
          onClick={() => setActiveTab('commentary')}
          className={cn(
            'shrink-0 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
            activeTab === 'commentary'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          )}
        >
          Ball Commentary
        </button>

        <button
          role="tab"
          aria-selected={activeTab === 'info'}
          id="tab-info"
          aria-controls="panel-info"
          onClick={() => setActiveTab('info')}
          className={cn(
            'shrink-0 whitespace-nowrap px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all border-b-2 -mb-px outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
            activeTab === 'info'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-slate-400 hover:text-white'
          )}
        >
          Match Info &amp; Venue
        </button>
      </div>

      {/* TAB 1: SCORECARD */}
      {activeTab === 'scorecard' && (
        <div id="panel-scorecard" role="tabpanel" aria-labelledby="tab-scorecard" className="space-y-6">
          {isUpcoming && inningsList.length === 0 ? (
            <UpcomingMatchPreview match={matchData} />
          ) : inningsList.length > 0 && currentInnings ? (
            <>
              {/* Innings Selector Pills */}
              <InningsSelector
                inningsList={inningsList}
                selectedIndex={selectedInningsIndex}
                onSelectIndex={setSelectedInningsIndex}
                teams={matchData.teams}
              />

              {/* Batting Performance Table */}
              <BattingTable innings={currentInnings} battingTeam={battingTeam} />

              {/* Bowling Figures Table */}
              <BowlingTable bowlers={currentInnings.bowlers} bowlingTeam={bowlingTeam} />

              {/* Partnerships View */}
              <PartnershipsView partnerships={currentInnings.partnerships} />

              {/* Fall of Wickets Timeline */}
              <FallOfWickets fallOfWickets={currentInnings.fallOfWickets} />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center space-y-3">
              <p className="text-base font-semibold text-slate-200">
                Detailed scorecard not available for this fixture
              </p>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                The data provider has not supplied player-level batting or bowling statistics for this summarized fixture.
              </p>
              <Link
                href="/matches/match-ind-aus-ct26"
                className="inline-block mt-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 text-xs font-bold transition-colors"
              >
                View India vs Australia Live Scorecard
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SUMMARY */}
      {activeTab === 'summary' && (
        <div id="panel-summary" role="tabpanel" aria-labelledby="tab-summary">
          <MatchSummaryTab match={matchData} />
        </div>
      )}

      {/* TAB 3: COMMENTARY */}
      {activeTab === 'commentary' && (
        <div id="panel-commentary" role="tabpanel" aria-labelledby="tab-commentary">
          <MatchCommentaryTab commentary={scorecard?.commentary} />
        </div>
      )}

      {/* TAB 4: MATCH INFO */}
      {activeTab === 'info' && (
        <div id="panel-info" role="tabpanel" aria-labelledby="tab-info">
          <MatchInfoTab match={matchData} />
        </div>
      )}

      {/* Other Matches Navigation Strip */}
      {allMatches.length > 0 && (
        <div className="pt-8 border-t border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Switch Fixture
            </h3>
            <Link href="/" className="text-xs text-emerald-400 hover:text-emerald-300">
              View All Fixtures →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allMatches.slice(0, 8).map((m) => (
              <Link
                key={m.id}
                href={`/matches/${m.id}`}
                className={cn(
                  'p-3 rounded-xl border text-xs transition-all flex items-center justify-between',
                  m.id === matchData.id
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-white font-bold ring-1 ring-emerald-500/20'
                    : 'border-white/5 bg-[#0B111E] text-slate-300 hover:border-white/20 hover:text-white'
                )}
              >
                <div className="min-w-0 pr-2">
                  <span className="block font-semibold truncate">{m.shortTitle}</span>
                  <span className="text-[10px] text-slate-500">{m.format}</span>
                </div>
                <StatusBadge status={m.status} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
