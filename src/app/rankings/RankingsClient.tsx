'use client';

import React, { useState } from 'react';
import { RankingEntry } from '@/types/cricket';
import { Award, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingsClientProps {
  rankingsData: {
    teams: Record<'TEST' | 'ODI' | 'T20I', RankingEntry[]>;
    batting: Record<'TEST' | 'ODI' | 'T20I', RankingEntry[]>;
    bowling: Record<'TEST' | 'ODI' | 'T20I', RankingEntry[]>;
  };
}

export function RankingsClient({ rankingsData }: RankingsClientProps) {
  const [activeCategory, setActiveCategory] = useState<'teams' | 'batting' | 'bowling'>('teams');
  const [activeFormat, setActiveFormat] = useState<'TEST' | 'ODI' | 'T20I'>('TEST');

  const currentList = rankingsData[activeCategory][activeFormat] || [];

  return (
    <div className="space-y-6">
      {/* Category Pills & Format Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#0B111E] p-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          {(['teams', 'batting', 'bowling'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all',
                activeCategory === cat
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
              )}
            >
              {cat === 'teams' ? 'Team Rankings' : cat === 'batting' ? 'Batter Rankings' : 'Bowler Rankings'}
            </button>
          ))}
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
          {(['TEST', 'ODI', 'T20I'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setActiveFormat(fmt)}
              className={cn(
                'rounded-lg px-3 py-1 font-mono text-[11px] font-bold transition-all',
                activeFormat === fmt
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              )}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Rankings Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B111E] shadow-xl">
        <div className="border-b border-white/10 bg-white/5 px-4 py-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
              Official ICC {activeFormat} {activeCategory.toUpperCase()} Standings
            </span>
          </div>
          <span className="font-mono text-[11px] text-slate-400">
            Updated Weekly • Top 5 Verified
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/10 bg-black/20 text-slate-400 font-mono text-[11px] uppercase">
              <tr>
                <th className="py-3 px-4 sm:px-6 w-16">Rank</th>
                <th className="py-3 px-3">
                  {activeCategory === 'teams' ? 'Team' : 'Player'}
                </th>
                <th className="py-3 px-3 text-center w-24">Country</th>
                <th className="py-3 px-3 text-right">Rating</th>
                {activeCategory === 'teams' && (
                  <th className="py-3 px-4 sm:px-6 text-right">Points</th>
                )}
                <th className="py-3 px-4 text-center w-20">Shift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-sans">
              {currentList.map((entry) => (
                <tr
                  key={`${entry.rank}-${entry.name}`}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-white text-sm">
                    {entry.rank === 1 ? (
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold">
                        1
                      </span>
                    ) : (
                      <span>#{entry.rank}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="font-bold text-white text-sm">{entry.name}</span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-300">
                      {entry.teamCode}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-400 text-sm tabular-nums">
                    {entry.rating}
                  </td>
                  {activeCategory === 'teams' && (
                    <td className="py-3.5 px-4 sm:px-6 text-right font-mono text-slate-400 tabular-nums">
                      {entry.points?.toLocaleString() || '-'}
                    </td>
                  )}
                  <td className="py-3.5 px-4 text-center">
                    {entry.rankChange && entry.rankChange > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-emerald-400 font-mono text-xs">
                        <ArrowUp className="h-3 w-3" />
                        <span>+{entry.rankChange}</span>
                      </span>
                    ) : entry.rankChange && entry.rankChange < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-rose-400 font-mono text-xs">
                        <ArrowDown className="h-3 w-3" />
                        <span>{entry.rankChange}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center text-slate-500">
                        <Minus className="h-3 w-3" />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
