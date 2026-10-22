'use client';

import React from 'react';
import { CricketInnings, CricketTeam } from '@/types/cricket';
import { formatOversNotation } from '@/lib/cricketOvers';
import { cn } from '@/lib/utils';

interface InningsSelectorProps {
  inningsList: CricketInnings[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  teams: {
    home: CricketTeam;
    away: CricketTeam;
  };
}

function resolveBattingTeam(
  inn: CricketInnings,
  teams: { home: CricketTeam; away: CricketTeam }
): CricketTeam {
  if (teams.home.id && inn.battingTeamId === teams.home.id) return teams.home;
  if (teams.away.id && inn.battingTeamId === teams.away.id) return teams.away;
  if (teams.home.code && inn.battingTeamId?.toLowerCase() === teams.home.code.toLowerCase()) {
    return teams.home;
  }
  if (teams.away.code && inn.battingTeamId?.toLowerCase() === teams.away.code.toLowerCase()) {
    return teams.away;
  }
  if (teams.home.name && inn.battingTeamId?.toLowerCase() === teams.home.name.toLowerCase()) {
    return teams.home;
  }
  if (teams.away.name && inn.battingTeamId?.toLowerCase() === teams.away.name.toLowerCase()) {
    return teams.away;
  }
  return inn.inningsNumber === 1 ? teams.home : teams.away;
}

export function InningsSelector({
  inningsList,
  selectedIndex,
  onSelectIndex,
  teams,
}: InningsSelectorProps) {
  if (inningsList.length <= 1) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      onSelectIndex((selectedIndex + 1) % inningsList.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onSelectIndex((selectedIndex - 1 + inningsList.length) % inningsList.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      onSelectIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      onSelectIndex(inningsList.length - 1);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Match Innings Selector"
      onKeyDown={handleKeyDown}
      className="flex flex-wrap gap-2 pt-2"
    >
      {inningsList.map((inn, idx) => {
        const battingTeam = resolveBattingTeam(inn, teams);
        const isSelected = selectedIndex === idx;
        const inningsOrdinal = inn.isSuperOver
          ? 'Super Over'
          : `${inn.inningsNumber === 1 ? '1st' : '2nd'} Inn`;

        return (
          <button
            key={`${inn.inningsNumber}-${idx}`}
            role="tab"
            aria-selected={isSelected}
            aria-controls={`innings-panel-${idx}`}
            id={`innings-tab-${idx}`}
            onClick={() => onSelectIndex(idx)}
            className={cn(
              'group flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all border outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              isSelected
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md ring-1 ring-emerald-500/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
            )}
          >
            <span className="font-bold text-white group-hover:text-emerald-200">
              {battingTeam.code}
            </span>

            <span className="text-[11px] font-mono text-slate-400">
              ({inningsOrdinal})
            </span>

            {inn.isSuperOver && (
              <span className="rounded bg-purple-500/30 border border-purple-500/50 px-1.5 py-0.2 font-mono text-[9px] font-bold text-purple-300 uppercase">
                SO
              </span>
            )}

            <span className="font-mono tabular-nums text-slate-200">
              {inn.runs}/{inn.wickets}
            </span>

            <span className="font-mono text-[11px] text-slate-400">
              ({formatOversNotation(inn.oversDetail || inn.overs)})
            </span>

            {inn.declared && (
              <span className="rounded bg-amber-500/20 border border-amber-500/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-amber-300 uppercase">
                Dec
              </span>
            )}

            {(inn.isAllOut || inn.wickets >= 10) && (
              <span className="rounded bg-rose-500/20 border border-rose-500/40 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-300 uppercase">
                All Out
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
