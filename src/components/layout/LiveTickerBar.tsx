'use client';

import React from 'react';
import Link from 'next/link';
import { CRICKET_FIXTURES } from '@/data/fixtures';
import { useTimezone } from '@/context/TimezoneContext';
import { Clock, Globe, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LiveTickerBar() {
  const { timezoneMode, toggleTimezoneMode, currentClock, timezoneLabel } = useTimezone();

  return (
    <div className="relative z-50 h-9 w-full border-b border-white/8 bg-[#04060B]/95 text-xs font-medium text-slate-300 backdrop-blur-md select-none">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6">
        {/* Left: 6 Channel Quick Ticker */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 pr-2 border-r border-white/10 shrink-0">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
              MATRIX
            </span>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {CRICKET_FIXTURES.map((ch) => {
              const isLive = ch.status === 'LIVE';
              const isStumps = ch.status === 'STUMPS' || ch.status === 'INNINGS_BREAK';

              return (
                <Link
                  key={ch.id}
                  href={`/live/${ch.slug}`}
                  prefetch={false}
                  className={cn(
                    'tv-focusable group flex items-center space-x-1.5 rounded px-2 py-0.5 transition-colors',
                    'hover:bg-white/5 border border-transparent hover:border-white/10',
                    isLive && 'bg-rose-950/20 border-rose-500/20 hover:border-rose-500/40'
                  )}
                  title={`${ch.title} - ${ch.status}`}
                >
                  {/* Channel Number Monospace Badge */}
                  <span className="font-mono text-[10px] font-bold text-slate-400 group-hover:text-emerald-400">
                    CH 0{ch.channelNumber}
                  </span>

                  {/* Status Indicator Dot */}
                  <span className="relative flex h-2 w-2 items-center justify-center">
                    {isLive && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    )}
                    <span
                      className={cn(
                        'relative inline-flex h-1.5 w-1.5 rounded-full',
                        isLive && 'bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)]',
                        isStumps && 'bg-amber-400',
                        !isLive && !isStumps && 'bg-slate-500'
                      )}
                    />
                  </span>

                  {/* Match Matchup Short Code */}
                  <span className="text-[11px] font-semibold text-slate-200 group-hover:text-white">
                    {ch.shortTitle}
                  </span>

                  {isLive && (
                    <span className="rounded bg-rose-500/20 px-1 py-[1px] text-[9px] font-bold text-rose-400 tracking-wider">
                      LIVE
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right: Master Clock & Timezone Selector */}
        <div className="flex items-center space-x-3 shrink-0 pl-3">
          {/* Timezone Switcher Pill */}
          <button
            type="button"
            onClick={toggleTimezoneMode}
            className="tv-focusable flex items-center space-x-1.5 rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-300 transition-all hover:bg-white/10 hover:text-white border border-white/10"
            title={`Switch to ${timezoneMode === 'local' ? 'UTC' : 'Local'} time. Active: ${timezoneLabel}`}
          >
            <Globe className="h-3 w-3 text-emerald-400" />
            <span className="font-mono uppercase tracking-wider text-[10px] font-semibold">
              {timezoneMode === 'local' ? 'LOCAL' : 'UTC'}
            </span>
            <span className="hidden lg:inline text-[10px] text-slate-400">
              ({timezoneLabel})
            </span>
          </button>

          {/* Tabular Monospace Digital Clock */}
          <div className="flex items-center space-x-1 font-mono text-[11px] font-semibold text-emerald-400 tabular-nums">
            <Clock className="h-3 w-3 text-slate-400" />
            <span>{currentClock}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
