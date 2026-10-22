import React from 'react';
import type { Metadata } from 'next';
import { cricketService } from '@/services/cricketService';
import { MatchCard } from '@/components/matches/MatchCard';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { Trophy, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cricket Tournaments & Bilateral Series | CricLive',
  description:
    'Explore major cricket series, ICC events, bilateral tours, and premier franchise leagues with schedules, standings, and tournament structures.',
};

export default async function SeriesPage() {
  const [competitions, allMatches] = await Promise.all([
    cricketService.getCompetitions(),
    cricketService.getMatches(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Trophy className="h-6 w-6 text-amber-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cricket Tournaments &amp; Series
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse ICC world events, historic bilateral trophies, and premier domestic T20 leagues.
          </p>
        </div>

        <DemoDataBadge />
      </div>

      {/* Series Cards Showcase */}
      <div className="space-y-12">
        {competitions.map((c) => {
          const seriesMatches = allMatches.filter(
            (m) => m.seriesId === c.id || m.competition.includes(c.shortName)
          );

          return (
            <section
              key={c.id}
              id={c.id}
              className="rounded-3xl border border-white/10 bg-[#0B111E] p-6 sm:p-8 space-y-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400 uppercase">
                      {c.format}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        c.status === 'ONGOING'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {c.status}
                    </span>
                    <span className="font-mono text-xs text-slate-400">
                      Season {c.season}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {c.name}
                  </h2>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span>{c.teamsCount} Teams</span>
                  </div>
                  {c.trophyHolder && (
                    <div className="flex items-center gap-1.5 text-amber-300">
                      <Trophy className="h-4 w-4 text-amber-400" />
                      <span>Holder: {c.trophyHolder}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Related Matches in this tournament */}
              {seriesMatches.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                    Tournament Fixtures ({seriesMatches.length})
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {seriesMatches.map((match) => (
                      <MatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-xs text-slate-400">
                  Fixtures for {c.name} will be announced closer to the tournament window ({c.startDate} to {c.endDate}).
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
