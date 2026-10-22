import React from 'react';
import type { Metadata } from 'next';
import { cricketService } from '@/services/cricketService';
import { MatchCenterFilter } from '@/components/matches/MatchCenterFilter';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Recent Cricket Results & Match Scorecards | CricLive',
  description:
    'Comprehensive cricket match results, winning margins, completed scorecards, and player of the match awards across world cricket.',
};

export default async function ResultsPage() {
  const allMatches = await cricketService.getMatches();
  const completedMatches = await cricketService.getResults();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Recent Cricket Results
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Verified match conclusions, victory margins, and scorecard archives.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DemoDataBadge />
          <span className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-emerald-400">
            {completedMatches.length} Matches Concluded
          </span>
        </div>
      </div>

      {/* Interactive Match Center defaulted to COMPLETED */}
      <MatchCenterFilter initialMatches={allMatches} defaultStatus="COMPLETED" />
    </div>
  );
}
