'use client';

import React from 'react';
import { CricketPartnership } from '@/types/cricket';
import { formatOversNotation } from '@/lib/cricketOvers';
import { Users } from 'lucide-react';

interface PartnershipsViewProps {
  partnerships?: CricketPartnership[];
}

export function PartnershipsView({ partnerships }: PartnershipsViewProps) {
  if (!partnerships || partnerships.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0B111E] p-4 text-xs text-slate-500 font-mono">
        Partnership breakdown not supplied by provider for this innings.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-4 sm:p-6 space-y-4 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
            Partnerships Breakdown
          </h4>
        </div>
        <span className="font-mono text-[11px] text-slate-500">
          {partnerships.length} Stands
        </span>
      </div>

      <div className="space-y-3">
        {partnerships.map((p, idx) => {
          const b1Name = p.batter1?.name || 'Batter 1';
          const b1Runs = p.batter1?.runs ?? 0;
          const b1Balls = p.batter1?.balls ?? 0;

          const b2Name = p.batter2?.name || 'Batter 2';
          const b2Runs = p.batter2?.runs ?? 0;
          const b2Balls = p.batter2?.balls ?? 0;

          const totalRuns = p.runs ?? (b1Runs + b2Runs);
          const totalBalls = p.balls ?? (b1Balls + b2Balls);
          const divisor = totalRuns > 0 ? totalRuns : 1;
          const b1Ratio = Math.max(0, Math.min(100, Math.round((b1Runs / divisor) * 100)));
          const b2Ratio = 100 - b1Ratio;

          const oversDisplay = p.overs ? `, ${formatOversNotation(p.overs)}` : '';

          return (
            <div
              key={idx}
              className="rounded-xl bg-white/5 border border-white/5 p-3 space-y-2 hover:border-emerald-500/20 transition-all"
            >
              {/* Top row: Wicket label and total stand */}
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">
                  <strong className="text-emerald-400">{p.wicket}</strong>
                  {p.wicket === 1 ? 'st' : p.wicket === 2 ? 'nd' : p.wicket === 3 ? 'rd' : 'th'} Wicket
                </span>

                <span className="font-bold text-white">
                  {totalRuns} runs{' '}
                  <span className="font-normal text-slate-400">
                    ({totalBalls} balls{oversDisplay})
                  </span>
                </span>
              </div>

              {/* Progress bar showing batter contributions */}
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden flex">
                <div
                  style={{ width: `${b1Ratio}%` }}
                  className="bg-emerald-500 transition-all"
                  title={`${b1Name}: ${b1Runs} (${b1Ratio}%)`}
                />
                <div
                  style={{ width: `${b2Ratio}%` }}
                  className="bg-cyan-500 transition-all"
                  title={`${b2Name}: ${b2Runs} (${b2Ratio}%)`}
                />
              </div>

              {/* Batter names and split */}
              <div className="flex items-center justify-between text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-slate-300 truncate">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                  <span className="truncate">{b1Name}</span>
                  <strong className="text-white">
                    {b1Runs} ({b1Balls})
                  </strong>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 truncate justify-end">
                  <strong className="text-white">
                    {b2Runs} ({b2Balls})
                  </strong>
                  <span className="truncate">{b2Name}</span>
                  <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
