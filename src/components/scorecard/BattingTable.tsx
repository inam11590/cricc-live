'use client';

import React from 'react';
import { CricketInnings, CricketTeam } from '@/types/cricket';
import { formatOversNotation, calculateRunRate } from '@/lib/cricketOvers';
import { cn } from '@/lib/utils';

interface BattingTableProps {
  innings: CricketInnings;
  battingTeam: CricketTeam;
}

export function BattingTable({ innings, battingTeam }: BattingTableProps) {
  const oversSpec = innings.oversDetail || innings.overs;
  const runRate = calculateRunRate(innings.runs, oversSpec);
  const extras = innings.extras;
  const extrasTotal = extras
    ? extras.total ??
      ((extras.byes || 0) +
        (extras.legByes || 0) +
        (extras.wides || 0) +
        (extras.noBalls || 0))
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B111E] shadow-xl">
      {/* Table Header Strip */}
      <div className="border-b border-white/10 bg-white/5 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            {battingTeam.name} Batting
          </h3>
          {innings.isSuperOver && (
            <span className="rounded bg-purple-500/20 border border-purple-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-300 uppercase">
              Super Over
            </span>
          )}
          {innings.declared && (
            <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-300 uppercase">
              Declared
            </span>
          )}
          {(innings.isAllOut || innings.wickets >= 10) && (
            <span className="rounded bg-rose-500/20 border border-rose-500/40 px-2 py-0.5 text-[10px] font-mono font-bold text-rose-300 uppercase">
              All Out
            </span>
          )}
        </div>

        <div className="font-mono text-xs text-slate-400">
          Total: <strong className="text-white">{innings.runs}/{innings.wickets}</strong> in{' '}
          {formatOversNotation(oversSpec)} (RR: <strong className="text-emerald-400">{runRate}</strong>)
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs min-w-[540px]">
          <thead className="border-b border-white/10 bg-black/20 text-slate-400 font-mono text-[11px] uppercase">
            <tr>
              <th className="py-3 px-4 sm:px-6">Batter</th>
              <th className="py-3 px-3">Dismissal</th>
              <th className="py-3 px-3 text-right">R</th>
              <th className="py-3 px-3 text-right">B</th>
              <th className="py-3 px-3 text-right">4s</th>
              <th className="py-3 px-3 text-right">6s</th>
              <th className="py-3 px-4 sm:px-6 text-right">SR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-sans">
            {innings.batters && innings.batters.length > 0 ? (
              innings.batters.map((batter) => {
                const bRuns = batter.runs ?? 0;
                const bBalls = batter.balls ?? 0;
                const srDisplay =
                  typeof batter.strikeRate === 'number' && !isNaN(batter.strikeRate)
                    ? batter.strikeRate.toFixed(2)
                    : bBalls > 0
                    ? ((bRuns / bBalls) * 100).toFixed(2)
                    : '-';

                return (
                  <tr
                    key={batter.playerId}
                    className={cn(
                      'hover:bg-white/5 transition-colors',
                      batter.isNotOut && 'bg-emerald-500/5'
                    )}
                  >
                    <td className="py-3 px-4 sm:px-6">
                      <span className="font-bold text-white">
                        {batter.name || 'Unnamed Batter'}
                      </span>
                      {batter.isNotOut && (
                        <span className="ml-1 text-emerald-400 font-bold" title="Not Out">*</span>
                      )}
                      {batter.isCurrentStriker && (
                        <span className="ml-1.5 rounded bg-emerald-500/20 px-1 py-0.2 font-mono text-[9px] font-bold text-emerald-400">
                          ON STRIKE
                        </span>
                      )}
                      {batter.role && (
                        <span className="block text-[10px] text-slate-500 font-normal">
                          {batter.role}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {batter.dismissal || (batter.isNotOut ? 'not out' : 'did not bat')}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-white tabular-nums">
                      {bRuns}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {bBalls}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {batter.fours ?? 0}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-400 tabular-nums">
                      {batter.sixes ?? 0}
                    </td>
                    <td className="py-3 px-4 sm:px-6 text-right font-mono font-medium text-slate-300 tabular-nums">
                      {srDisplay}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="py-6 px-4 text-center text-slate-500 font-mono text-xs">
                  Batting breakdown not supplied by provider for this innings.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Extras & Totals Strip */}
      <div className="border-t border-white/10 bg-white/5 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 font-mono">
        <div>
          <span>Extras: </span>
          {extrasTotal !== null ? (
            <>
              <strong className="text-white">{extrasTotal}</strong>
              <span className="text-slate-500 text-[11px] ml-1">
                (b {extras?.byes ?? 0}, lb {extras?.legByes ?? 0}, w {extras?.wides ?? 0}, nb {extras?.noBalls ?? 0})
              </span>
            </>
          ) : (
            <span className="text-slate-500 italic">Not supplied</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span>
            Run Rate: <strong className="text-slate-200">{runRate}</strong>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-white font-bold">
            TOTAL: {innings.runs}/{innings.wickets}{' '}
            <span className="font-normal text-slate-300">
              ({formatOversNotation(oversSpec)})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
