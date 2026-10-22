import React from 'react';
import type { Metadata } from 'next';
import { cricketService } from '@/services/cricketService';
import { FeaturedMatchCard } from '@/components/matches/FeaturedMatchCard';
import { MatchCenterFilter } from '@/components/matches/MatchCenterFilter';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { Activity } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Live Cricket Scores & Real-Time Commentary | CricLive',
  description:
    'Live cricket scores, ball-by-ball commentary, current run rates, required run rates, and scorecard telemetry for international and league cricket.',
};

export default async function LiveScoresPage() {
  const [liveMatches, allMatches, featuredMatch] = await Promise.all([
    cricketService.getLiveMatches(),
    cricketService.getMatches(),
    cricketService.getFeaturedMatch(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Live Scores &amp; Match Center
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time cricket encounters currently in progress across world cricket.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoDataBadge />
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5" />
            <span>{liveMatches.length} Matches On-Air</span>
          </span>
        </div>
      </div>

      {/* Featured Live Match */}
      {featuredMatch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Prime Live Feature
            </h2>
          </div>
          <FeaturedMatchCard match={featuredMatch} />
        </div>
      )}

      {/* Live Matches Filter Grid */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          All Active Fixtures
        </h2>
        <MatchCenterFilter initialMatches={allMatches} defaultStatus="LIVE" />
      </div>
    </div>
  );
}
