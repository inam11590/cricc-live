import React from 'react';
import Link from 'next/link';
import { CricketMatch } from '@/types/cricket';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { MapPin, ArrowRight, Activity, Target } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeaturedMatchCardProps {
  match: CricketMatch;
  className?: string;
}

export function FeaturedMatchCard({ match, className }: FeaturedMatchCardProps) {
  // Extract home and away innings scores
  const homeScore = match.scores?.home?.[match.scores.home.length - 1];
  const awayScore = match.scores?.away?.[match.scores.away.length - 1];

  // Active scorecard batters and bowlers if available
  const currentInnings = match.scorecard?.innings?.[match.scorecard.innings.length - 1];
  const activeBatters = currentInnings?.batters?.filter((b) => b.isNotOut) || [];
  const activeBowler = currentInnings?.bowlers?.find((b) => b.isCurrentBowler);

  return (
    <article
      className={cn(
        'relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F172A] to-[#080E1A] p-6 sm:p-8 shadow-2xl glass-card transition-all',
        className
      )}
      aria-label={`Featured match: ${match.title}`}
    >
      {/* Background stadium floodlight atmosphere */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-rose-500/5 blur-3xl pointer-events-none" />

      {/* Header bar: Competition, Format & Status */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 font-mono text-xs font-bold text-emerald-400 uppercase">
            {match.format}
          </span>
          <span className="text-xs font-semibold text-slate-300">
            {match.competition}
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-slate-500" />
            <span>
              {match.venue.name}, {match.venue.city}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DemoDataBadge
            isDemo={match.isDemo}
            source={match.dataSource}
            lastUpdated={match.lastUpdatedUtc}
          />
          <StatusBadge status={match.status} />
        </div>
      </div>

      {/* Main Score & Teams Arena */}
      <div className="relative z-10 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Team (Home) */}
        <div className="lg:col-span-5 flex items-center justify-between sm:justify-start gap-4">
          <div className="flex items-center gap-3.5">
            <TeamBadge team={match.teams.home} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {match.teams.home.name}
                </h3>
                {match.currentBattingTeamId === match.teams.home.id && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400" title="Currently Batting" />
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">
                {match.teams.home.country}
              </p>
            </div>
          </div>

          <div className="text-right sm:ml-auto">
            {homeScore ? (
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                  {homeScore.runs}/{homeScore.wickets}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  ({homeScore.overs} ov) {homeScore.runRate && `• RR: ${homeScore.runRate}`}
                </div>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500 uppercase">Yet to bat</span>
            )}
          </div>
        </div>

        {/* Center VS & Telemetry Divider */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center py-2 lg:py-0 border-y lg:border-y-0 lg:border-x border-white/5">
          <span className="font-mono text-xs font-black tracking-widest text-slate-500 uppercase">
            VS
          </span>
          {match.target && (
            <div className="mt-1 flex items-center gap-1 text-[11px] font-mono text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded">
              <Target className="h-3 w-3" />
              <span>Target: {match.target}</span>
            </div>
          )}
        </div>

        {/* Right Team (Away) */}
        <div className="lg:col-span-5 flex items-center justify-between sm:justify-start gap-4 flex-row-reverse lg:flex-row">
          <div className="text-left sm:text-right sm:mr-auto lg:mr-0 lg:ml-auto order-2 lg:order-1">
            {awayScore ? (
              <div>
                <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-tight tabular-nums">
                  {awayScore.runs}/{awayScore.wickets}
                </div>
                <div className="text-xs font-mono text-slate-400">
                  ({awayScore.overs} ov) {awayScore.runRate && `• RR: ${awayScore.runRate}`}
                </div>
              </div>
            ) : (
              <span className="text-xs font-mono text-slate-500 uppercase">Yet to bat</span>
            )}
          </div>

          <div className="flex items-center gap-3.5 order-1 lg:order-2">
            <TeamBadge team={match.teams.away} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {match.teams.away.name}
                </h3>
                {match.currentBattingTeamId === match.teams.away.id && (
                  <span className="h-2 w-2 rounded-full bg-emerald-400" title="Currently Batting" />
                )}
              </div>
              <p className="text-xs font-mono text-slate-400">
                {match.teams.away.country}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Match Situation Verdict Strip */}
      <div className="relative z-10 rounded-2xl border border-white/5 bg-[#080E1A]/80 p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                Current Match Situation
              </span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-emerald-300">
              {match.statusText}
            </p>
          </div>

          {/* Telemetry Rates */}
          {(match.requiredRunRate || match.currentRunRate) && (
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400 border-t md:border-t-0 md:border-l border-white/10 pt-2 md:pt-0 md:pl-4">
              {match.currentRunRate && (
                <div>
                  <span className="text-slate-500 block text-[10px]">CURRENT RR</span>
                  <span className="text-slate-200 font-bold text-sm">{match.currentRunRate}</span>
                </div>
              )}
              {match.requiredRunRate && (
                <div>
                  <span className="text-slate-500 block text-[10px]">REQUIRED RR</span>
                  <span className="text-amber-400 font-bold text-sm">{match.requiredRunRate}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live crease telemetry if batters on crease */}
        {activeBatters.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-slate-500 font-mono text-[11px]">CREASE:</span>
              <div className="flex items-center gap-2 font-mono">
                {activeBatters.map((b) => (
                  <span key={b.playerId} className="bg-white/5 px-2 py-0.5 rounded text-white font-medium">
                    {b.name.split(' ')[0]} {b.runs}* ({b.balls})
                  </span>
                ))}
              </div>
            </div>

            {activeBowler && (
              <div className="flex items-center gap-2 text-slate-300 sm:justify-end">
                <span className="text-slate-500 font-mono text-[11px]">BOWLING:</span>
                <span className="bg-white/5 px-2 py-0.5 rounded font-mono text-white font-medium">
                  {activeBowler.name.split(' ')[0]} {activeBowler.overs}-{activeBowler.maidens}-{activeBowler.runs}-{activeBowler.wickets}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="relative z-10 mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
        <div className="text-xs text-slate-400 font-mono">
          {match.scorecard?.toss && (
            <span>Toss: {match.scorecard.toss}</span>
          )}
        </div>

        <Link
          href={`/matches/${match.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <span>View Full Scorecard &amp; Commentary</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
