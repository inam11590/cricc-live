import React from 'react';
import Link from 'next/link';
import { Competition } from '@/types/cricket';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';

interface TournamentsSectionProps {
  competitions: Competition[];
}

export function TournamentsSection({ competitions }: TournamentsSectionProps) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Featured Tournaments &amp; Series
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global ICC marquee events, bilateral rivalries, and premier franchise cricket leagues.
          </p>
        </div>

        <Link
          href="/series"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>View all tournaments</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {competitions.map((c) => (
          <div
            key={c.id}
            className="group relative rounded-2xl border border-white/8 bg-[#0B111E] p-5 hover:border-emerald-500/40 hover:bg-[#0D1527] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
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
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                {c.name}
              </h3>

              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Season {c.season}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-slate-500" />
                  <span>{c.teamsCount} Competing Nations / Franchises</span>
                </div>
                {c.trophyHolder && (
                  <div className="flex items-center gap-2 text-amber-300/90 font-mono text-[11px]">
                    <Trophy className="h-3.5 w-3.5 text-amber-400" />
                    <span>Defending Champions: {c.trophyHolder}</span>
                  </div>
                )}
              </div>
            </div>

            <Link
              href={`/series#${c.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 group-hover:text-emerald-400 transition-colors pt-2 border-t border-white/5"
            >
              <span>Explore Series Schedule</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
