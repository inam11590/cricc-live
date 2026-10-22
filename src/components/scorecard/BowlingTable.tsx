'use client';

import React from 'react';
import { CricketBowlingFigures, CricketTeam } from '@/types/cricket';
import { formatOversNotation, calculateEconomy } from '@/lib/cricketOvers';
import { cn } from '@/lib/utils';

interface BowlingTableProps {
  bowlers?: CricketBowlingFigures[];
  bowlingTeam: CricketTeam;
}

export function BowlingTable({ bowlers = [], bowlingTeam }: BowlingTableProps) {
  if (!bowlers || bowlers.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0B111E] p-5 text-center space-y-1 shadow-lg">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          {bowlingTeam.name} Bowling
        </h3>
        <p className="text-xs text-slate-500 font-mono">
          Bowling figures not supplied by provider for this innings.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B111E] shadow-xl">
      <div className="border-b border-white/10 bg-white/5 px-4 py-3 sm:px-6 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          {bowlingTeam.name} Bowling
        </h3>
        <span className="font-mono text-xs text-slate-400">
          {bowlers.length} Bowlers Used
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[480px]">
          <thead className="border-b border-white/10 bg-black/20 text-slate-400 font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4 sm:px-6">Bowler</th>
              <th className="py-3 px-3 text-right">O</th>
              <th className="py-3 px-3 text-right">M</th>
              <th className="py-3 px-3 text-right">R</th>
              <th className="py-3 px-3 text-right">W</th>
              <th className="py-3 px-4 sm:px-6 text-right">ECON</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {bowlers.map((bowler) => {
              const oversSpec = bowler.oversDetail || bowler.overs;
              const econDisplay =
                typeof bowler.economy === 'number' && !isNaN(bowler.economy)
                  ? bowler.economy.toFixed(2)
                  : typeof bowler.runs === 'number' && oversSpec !== undefined
                  ? calculateEconomy(bowler.runs, oversSpec).toFixed(2)
                  : '-';

              return (
                <tr
                  key={bowler.playerId}
                  className={cn(
                    'hover:bg-white/5 transition-colors',
                    bowler.isCurrentBowler && 'bg-emerald-500/5'
                  )}
                >
                  <td className="py-3 px-4 sm:px-6 font-bold text-white">
                    <div className="flex items-center gap-2">
                      <span>{bowler.name || 'Unnamed Bowler'}</span>
                      {bowler.isCurrentBowler && (
                        <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-emerald-400 uppercase">
                          Bowling
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                    {formatOversNotation(oversSpec, '')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                    {bowler.maidens ?? 0}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-300 tabular-nums">
                    {bowler.runs ?? 0}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                    {bowler.wickets ?? 0}
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-right font-mono font-medium text-slate-300 tabular-nums">
                    {econDisplay}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
