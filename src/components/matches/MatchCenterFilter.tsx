'use client';

import React, { useState, useMemo } from 'react';
import { CricketMatch } from '@/types/cricket';
import { MatchCard } from './MatchCard';
import { Calendar, CheckCircle2, Layers, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCenterFilterProps {
  initialMatches: CricketMatch[];
  defaultStatus?: 'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED';
}

export function MatchCenterFilter({
  initialMatches,
  defaultStatus = 'ALL',
}: MatchCenterFilterProps) {
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'COMPLETED'>(
    defaultStatus
  );
  const [selectedFormat, setSelectedFormat] = useState<'ALL' | 'TEST' | 'ODI' | 'T20'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Live match count for badge
  const liveCount = useMemo(
    () => initialMatches.filter((m) => m.status === 'LIVE' || m.status === 'STUMPS' || m.status === 'INNINGS_BREAK').length,
    [initialMatches]
  );
  const upcomingCount = useMemo(
    () => initialMatches.filter((m) => m.status === 'UPCOMING').length,
    [initialMatches]
  );
  const completedCount = useMemo(
    () => initialMatches.filter((m) => m.status === 'COMPLETED').length,
    [initialMatches]
  );

  // Filter logic
  const filteredMatches = useMemo(() => {
    return initialMatches.filter((match) => {
      // Status filter
      if (selectedStatus === 'LIVE') {
        if (match.status !== 'LIVE' && match.status !== 'STUMPS' && match.status !== 'INNINGS_BREAK') {
          return false;
        }
      } else if (selectedStatus === 'UPCOMING') {
        if (match.status !== 'UPCOMING') return false;
      } else if (selectedStatus === 'COMPLETED') {
        if (match.status !== 'COMPLETED') return false;
      }

      // Format filter
      if (selectedFormat === 'TEST' && match.format !== 'TEST') return false;
      if (selectedFormat === 'ODI' && match.format !== 'ODI') return false;
      if (selectedFormat === 'T20') {
        if (match.format !== 'T20' && match.format !== 'T20I' && match.format !== 'T20_LEAGUE') {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          match.title.toLowerCase().includes(q) ||
          match.teams.home.name.toLowerCase().includes(q) ||
          match.teams.away.name.toLowerCase().includes(q) ||
          match.teams.home.code.toLowerCase().includes(q) ||
          match.teams.away.code.toLowerCase().includes(q) ||
          match.competition.toLowerCase().includes(q) ||
          match.venue.city.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [initialMatches, selectedStatus, selectedFormat, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Control Bar: Status Tabs & Format Select */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-2xl border border-white/8 bg-[#0B111E]/80 p-3 sm:p-4 backdrop-blur-md">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2" role="tablist" aria-label="Filter matches by status">
          <button
            role="tab"
            aria-selected={selectedStatus === 'ALL'}
            onClick={() => setSelectedStatus('ALL')}
            className={cn(
              'rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              selectedStatus === 'ALL'
                ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            All Matches ({initialMatches.length})
          </button>

          <button
            role="tab"
            aria-selected={selectedStatus === 'LIVE'}
            onClick={() => setSelectedStatus('LIVE')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              selectedStatus === 'LIVE'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20 font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <span>Live ({liveCount})</span>
          </button>

          <button
            role="tab"
            aria-selected={selectedStatus === 'UPCOMING'}
            onClick={() => setSelectedStatus('UPCOMING')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              selectedStatus === 'UPCOMING'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Upcoming ({upcomingCount})</span>
          </button>

          <button
            role="tab"
            aria-selected={selectedStatus === 'COMPLETED'}
            onClick={() => setSelectedStatus('COMPLETED')}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
              selectedStatus === 'COMPLETED'
                ? 'bg-slate-700 text-white shadow-md font-bold'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
            )}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Completed ({completedCount})</span>
          </button>
        </div>

        {/* Right Controls: Format Filters & Search input */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Format pills */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
            {(['ALL', 'TEST', 'ODI', 'T20'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={cn(
                  'rounded-lg px-2.5 py-1 font-mono text-[11px] font-semibold transition-all',
                  selectedFormat === fmt
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {fmt === 'ALL' ? 'All Formats' : fmt}
              </button>
            ))}
          </div>

          {/* Quick Filter Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter matches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-xl border border-white/10 bg-white/5 pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 w-36 sm:w-44 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Grid of Match Cards */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center space-y-3">
          <Layers className="mx-auto h-8 w-8 text-slate-500" />
          <h4 className="text-base font-semibold text-slate-200">
            No matches found for current filter
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try switching the filter to &ldquo;All Matches&rdquo; or clearing the search term.
          </p>
          <button
            onClick={() => {
              setSelectedStatus('ALL');
              setSelectedFormat('ALL');
              setSearchQuery('');
            }}
            className="mt-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
