import React from 'react';
import type { Metadata } from 'next';
import { cricketService } from '@/services/cricketService';
import { RankingsClient } from './RankingsClient';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';
import { Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'ICC Cricket Rankings — Teams, Batters & Bowlers | CricLive',
  description:
    'Official ICC rankings for Test, ODI, and T20I cricket. Top team rankings, leading international batters, and top bowlers with ratings and points.',
};

export default async function RankingsPage() {
  const [
    testTeams,
    odiTeams,
    t20Teams,
    testBatting,
    odiBatting,
    t20Batting,
    testBowling,
    odiBowling,
    t20Bowling,
  ] = await Promise.all([
    cricketService.getRankings('teams', 'TEST'),
    cricketService.getRankings('teams', 'ODI'),
    cricketService.getRankings('teams', 'T20I'),
    cricketService.getRankings('batting', 'TEST'),
    cricketService.getRankings('batting', 'ODI'),
    cricketService.getRankings('batting', 'T20I'),
    cricketService.getRankings('bowling', 'TEST'),
    cricketService.getRankings('bowling', 'ODI'),
    cricketService.getRankings('bowling', 'T20I'),
  ]);

  const rankingsData = {
    teams: { TEST: testTeams, ODI: odiTeams, T20I: t20Teams },
    batting: { TEST: testBatting, ODI: odiBatting, T20I: t20Batting },
    bowling: { TEST: testBowling, ODI: odiBowling, T20I: t20Bowling },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Award className="h-6 w-6 text-emerald-400" />
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Official ICC Cricket Rankings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Global team ratings and player performance metrics across Test, ODI, and T20I formats.
          </p>
        </div>

        <DemoDataBadge />
      </div>

      <RankingsClient rankingsData={rankingsData} />
    </div>
  );
}
