'use client';

import React from 'react';
import { CricketMatch } from '@/types/cricket';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { formatOversNotation } from '@/lib/cricketOvers';
import {
  MapPin,
  Clock,
  RefreshCw,
  Share2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchHeaderBannerProps {
  match: CricketMatch;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  lastUpdatedLabel?: string;
  isStale?: boolean;
  refreshError?: string | null;
}

export function MatchHeaderBanner({
  match,
  isRefreshing = false,
  onRefresh,
  lastUpdatedLabel,
  isStale = false,
  refreshError = null,
}: MatchHeaderBannerProps) {
  const isMatchLive =
    match.status === 'LIVE' ||
    match.status === 'INNINGS_BREAK' ||
    match.status === 'TEA' ||
    match.status === 'LUNCH' ||
    match.status === 'STUMPS';

  // Format scheduled start time
  const formattedStartTime = React.useMemo(() => {
    try {
      const d = new Date(match.startTimeUtc);
      return (
        new Intl.DateTimeFormat('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'UTC',
        }).format(d) + ' UTC'
      );
    } catch {
      return match.startTimeUtc;
    }
  }, [match.startTimeUtc]);

  // Derive home and away scores from scores object, or fall back to scorecard.innings if missing
  const homeScores =
    match.scores?.home && match.scores.home.length > 0
      ? match.scores.home
      : (match.scorecard?.innings || [])
          .filter(
            (inn) =>
              inn.battingTeamId === match.teams.home.id ||
              inn.battingTeamId?.toLowerCase() === match.teams.home.code?.toLowerCase() ||
              (!inn.battingTeamId && inn.inningsNumber === 1)
          )
          .map((inn) => ({
            teamId: match.teams.home.id || 'home',
            inningsNumber: inn.inningsNumber,
            runs: inn.runs,
            wickets: inn.wickets,
            overs: inn.overs,
            declared: inn.declared,
          }));

  const awayScores =
    match.scores?.away && match.scores.away.length > 0
      ? match.scores.away
      : (match.scorecard?.innings || [])
          .filter(
            (inn) =>
              inn.battingTeamId === match.teams.away.id ||
              inn.battingTeamId?.toLowerCase() === match.teams.away.code?.toLowerCase() ||
              (!inn.battingTeamId && inn.inningsNumber === 2)
          )
          .map((inn) => ({
            teamId: match.teams.away.id || 'away',
            inningsNumber: inn.inningsNumber,
            runs: inn.runs,
            wickets: inn.wickets,
            overs: inn.overs,
            declared: inn.declared,
          }));

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F172A] to-[#080E1A] p-4 sm:p-6 lg:p-8 shadow-2xl glass-card">
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Meta Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-300 uppercase">
            {match.format}
          </span>
          <span className="font-semibold text-slate-200">{match.competition}</span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {match.venue.name}, {match.venue.city}
            </span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <span>{formattedStartTime}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DemoDataBadge
            isDemo={match.isDemo}
            source={match.dataSource}
            lastUpdated={match.lastUpdatedUtc}
            isStale={isStale}
          />
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Teams & Scoreboard Grid */}
      <div className="relative z-10 py-5 sm:py-6 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6 items-center">
        {/* Home Team */}
        <div
          className={cn(
            'flex items-center justify-between gap-2 p-3 sm:p-5 rounded-2xl border transition-all',
            match.currentBattingTeamId === match.teams.home.id
              ? 'bg-emerald-950/20 border-emerald-500/30 ring-1 ring-emerald-500/20'
              : 'bg-white/5 border-white/5'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <TeamBadge team={match.teams.home} size="md" className="shrink-0" />
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                  {match.teams.home.name}
                </h2>
                {match.currentBattingTeamId === match.teams.home.id && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    BATTING
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400 block truncate">
                {match.teams.home.code} • {match.teams.home.country || 'International'}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 pl-2">
            {homeScores && homeScores.length > 0 ? (
              <div className="space-y-0.5">
                {homeScores.map((inn, idx) => (
                  <div key={idx}>
                    <div className="font-mono text-xl sm:text-3xl font-extrabold text-white tabular-nums">
                      {inn.runs}/{inn.wickets}
                      {inn.declared && (
                        <span className="text-xs font-mono text-amber-400 ml-1">d</span>
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono text-slate-400">
                      ({formatOversNotation(inn.overs)})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500 uppercase">Yet to bat</span>
            )}
          </div>
        </div>

        {/* Away Team */}
        <div
          className={cn(
            'flex items-center justify-between gap-2 p-3 sm:p-5 rounded-2xl border transition-all',
            match.currentBattingTeamId === match.teams.away.id
              ? 'bg-emerald-950/20 border-emerald-500/30 ring-1 ring-emerald-500/20'
              : 'bg-white/5 border-white/5'
          )}
        >
          <div className="flex items-center gap-3 min-w-0">
            <TeamBadge team={match.teams.away} size="md" className="shrink-0" />
            <div className="min-w-0 truncate">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-xl font-bold text-white tracking-tight truncate">
                  {match.teams.away.name}
                </h2>
                {match.currentBattingTeamId === match.teams.away.id && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    BATTING
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-400 block truncate">
                {match.teams.away.code} • {match.teams.away.country || 'International'}
              </span>
            </div>
          </div>

          <div className="text-right shrink-0 pl-2">
            {awayScores && awayScores.length > 0 ? (
              <div className="space-y-0.5">
                {awayScores.map((inn, idx) => (
                  <div key={idx}>
                    <div className="font-mono text-xl sm:text-3xl font-extrabold text-white tabular-nums">
                      {inn.runs}/{inn.wickets}
                      {inn.declared && (
                        <span className="text-xs font-mono text-amber-400 ml-1">d</span>
                      )}
                    </div>
                    <div className="text-[11px] sm:text-xs font-mono text-slate-400">
                      ({formatOversNotation(inn.overs)})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500 uppercase">Yet to bat</span>
            )}
          </div>
        </div>
      </div>

      {/* Situation & Target Banner */}
      <div className="relative z-10 rounded-2xl border border-white/10 bg-[#0B111E]/90 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest block">
              Match Status &amp; Situation
            </span>
            <p className="text-base font-bold text-emerald-400 mt-0.5">
              {match.statusText || (match.status === 'COMPLETED' ? 'Match Concluded' : match.status)}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {match.target && (
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 text-xs font-mono text-amber-300">
                Target: <strong>{match.target}</strong>
              </div>
            )}
            {match.currentRunRate && (
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-mono text-slate-300">
                CRR: <strong className="text-emerald-400">{match.currentRunRate}</strong>
              </div>
            )}
            {match.requiredRunRate && (
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs font-mono text-slate-300">
                Req RR: <strong className="text-amber-400">{match.requiredRunRate}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Telemetry and Refresh Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            {isMatchLive ? (
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Live Feed Polling (20s)</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="h-3 w-3" />
                <span>Match {match.status.toLowerCase()} (Polling paused)</span>
              </span>
            )}

            {lastUpdatedLabel && (
              <>
                <span className="text-slate-600">•</span>
                <span>Updated: {lastUpdatedLabel}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50',
                  isRefreshing && 'cursor-not-allowed'
                )}
                aria-label="Refresh match scorecard"
              >
                <RefreshCw
                  className={cn('h-3 w-3', isRefreshing && 'animate-spin text-emerald-400')}
                />
                <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            )}

            <button
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Match link copied to clipboard!');
                }
              }}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="Share match"
            >
              <Share2 className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Stale / Network Error Warning */}
        {(isStale || refreshError) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-3.5 py-2 flex items-center gap-2 text-xs text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <span>
              {refreshError ||
                'Upstream feed temporarily unavailable. Displaying cached telemetry.'}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
