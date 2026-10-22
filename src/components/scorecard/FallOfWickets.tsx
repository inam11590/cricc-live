'use client';

import React from 'react';
import { FallOfWicket } from '@/types/cricket';
import { formatOversNotation } from '@/lib/cricketOvers';

interface FallOfWicketsProps {
  fallOfWickets?: FallOfWicket[];
}

export function FallOfWickets({ fallOfWickets }: FallOfWicketsProps) {
  if (!fallOfWickets || fallOfWickets.length === 0) {
    return (
      <div className="rounded-2xl border border-white/5 bg-[#0B111E] p-4 text-xs text-slate-500 font-mono">
        Fall of wickets breakdown not supplied by provider for this innings.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-4 sm:p-6 space-y-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
          Fall of Wickets
        </h4>
        <span className="font-mono text-[11px] text-slate-500">
          {fallOfWickets.length} Wickets
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs font-mono">
        {fallOfWickets.map((fow, idx) => {
          const wicketNum = fow.wicketNumber ?? idx + 1;
          const player = fow.playerOut || `Wicket ${wicketNum}`;
          const oversDisplay = formatOversNotation(fow.overs);

          return (
            <div
              key={wicketNum}
              className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-slate-300 hover:border-emerald-500/30 transition-colors"
            >
              <span className="text-white font-bold">
                {fow.score ?? '-'}/{wicketNum}
              </span>
              <span className="text-slate-400">({player}, {oversDisplay})</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
