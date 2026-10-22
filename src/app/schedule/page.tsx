import React from 'react';
import type { Metadata } from 'next';
import { cricketService } from '@/services/cricketService';
import { MatchCenterFilter } from '@/components/matches/MatchCenterFilter';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { Calendar } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cricket Match Schedule & Upcoming Fixtures | CricLive',
  description:
    'Complete international and league cricket schedule. Upcoming fixtures, dates, venues, and start times for ICC events, bilateral tours, and franchise leagues.',
};

export default async function SchedulePage() {
  const allMatches = await cricketService.getMatches();
  const upcomingMatches = await cricketService.getSchedule();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-emerald-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Cricket Schedule &amp; Upcoming Fixtures
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse upcoming bilateral series, ICC tournaments, and league schedules.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoDataBadge />
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-blue-400">
            {upcomingMatches.length} Upcoming Scheduled
          </span>
        </div>
      </div>

      {/* Interactive Match Center defaulted to UPCOMING */}
      <MatchCenterFilter initialMatches={allMatches} defaultStatus="UPCOMING" />
    </div>
  );
}
