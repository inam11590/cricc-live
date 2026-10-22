import React from 'react';
import Link from 'next/link';
import { CricketMatch } from '@/types/cricket';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: CricketMatch;
  className?: string;
}

export function MatchCard({ match, className }: MatchCardProps) {
  const homeScore = match.scores?.home?.[match.scores.home.length - 1];
  const awayScore = match.scores?.away?.[match.scores.away.length - 1];

  const isLive = match.status === 'LIVE' || match.status === 'INNINGS_BREAK' || match.status === 'STUMPS';

  // Format scheduled date
  const startDate = new Date(match.startTimeUtc);
  const timeFormatted = startDate.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article
      className={cn(
        'group relative flex flex-col justify-between rounded-2xl border border-white/8 bg-[#0B111E]/90 p-5 transition-all duration-200 hover:border-emerald-500/40 hover:bg-[#0D1527] shadow-lg',
        isLive && 'border-white/15 ring-1 ring-emerald-500/20',
        className
      )}
      aria-label={`${match.shortTitle} — ${match.competition}`}
    >
      {/* Top Meta: Format, Competition & Status */}
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase">
              {match.format}
            </span>
            <span className="truncate text-xs font-medium text-slate-400" title={match.competition}>
              {match.competition}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {match.isDemo && <DemoDataBadge />}
            <StatusBadge status={match.status} size="sm" />
          </div>
        </div>

        {/* Teams & Scores Grid */}
        <div className="py-4 space-y-3">
          {/* Home Team */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <TeamBadge team={match.teams.home} size="sm" />
              <div>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {match.teams.home.name}
                </span>
                {match.currentBattingTeamId === match.teams.home.id && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
            </div>

            <div className="text-right">
              {homeScore ? (
                <div className="font-mono text-sm font-bold text-white tabular-nums">
                  {homeScore.runs}/{homeScore.wickets}
                  <span className="text-[11px] text-slate-400 font-normal ml-1">
                    ({homeScore.overs})
                  </span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">Yet to bat</span>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <TeamBadge team={match.teams.away} size="sm" />
              <div>
                <span className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {match.teams.away.name}
                </span>
                {match.currentBattingTeamId === match.teams.away.id && (
                  <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </div>
            </div>

            <div className="text-right">
              {awayScore ? (
                <div className="font-mono text-sm font-bold text-white tabular-nums">
                  {awayScore.runs}/{awayScore.wickets}
                  <span className="text-[11px] text-slate-400 font-normal ml-1">
                    ({awayScore.overs})
                  </span>
                </div>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">Yet to bat</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Match Situation & Footer */}
      <div className="space-y-3 pt-3 border-t border-white/5">
        <p className="text-xs font-medium text-emerald-400 line-clamp-1">
          {match.statusText}
        </p>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3 w-3 shrink-0 text-slate-500" />
            <span className="truncate">{match.venue.city}</span>
          </div>

          {match.status === 'UPCOMING' && (
            <div className="flex items-center gap-1 shrink-0 font-mono text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{timeFormatted}</span>
            </div>
          )}
        </div>

        <Link
          href={`/matches/${match.id}`}
          className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 group-hover:text-emerald-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <span>Scorecard &amp; Center</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
