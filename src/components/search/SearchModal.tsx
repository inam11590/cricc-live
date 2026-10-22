'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Trophy, Radio, MapPin, ArrowRight } from 'lucide-react';
import { cricketService } from '@/services/cricketService';
import { CricketMatch, Competition } from '@/types/cricket';
import { TeamBadge } from '@/components/ui/TeamBadge';
import { StatusBadge } from '@/components/ui/StatusBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emptyResults = { matches: [], competitions: [], teams: [] };

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    matches: CricketMatch[];
    competitions: Competition[];
    teams: Array<{ name: string; code: string; country: string }>;
  }>(emptyResults);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery('');
    setResults(emptyResults);
    onClose();
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults(emptyResults);
    }
  };

  // Focus input and lock body scroll when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Execute debounced search when user types a non-empty query
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await cricketService.search(trimmed);
        setResults(res);
      } finally {
        setIsSearching(false);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults =
    results.matches.length + results.competitions.length + results.teams.length;

  const handleSelectMatch = (matchId: string) => {
    handleClose();
    router.push(`/matches/${matchId}`);
  };

  const handleSelectSeries = (seriesId: string) => {
    handleClose();
    router.push(`/series#${seriesId}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0B111E] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3 sm:px-6">
          <Search className="h-5 w-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            id="search-modal-title"
            type="text"
            placeholder="Search teams, live matches, tournaments, or venues..."
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full bg-transparent px-3 py-1.5 text-base text-white placeholder-slate-400 focus:outline-none"
            autoComplete="off"
          />
          {query && (
            <button
              onClick={() => handleQueryChange('')}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search input"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleClose}
            className="ml-2 rounded-lg border border-white/10 px-2 py-1 text-xs font-mono text-slate-400 hover:text-white hover:border-white/20 transition-all"
            aria-label="Close search modal"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {isSearching && (
            <div className="py-8 text-center text-sm text-slate-400">
              <span className="inline-block animate-spin mr-2">⟳</span>
              Searching cricket database...
            </div>
          )}

          {!isSearching && query.trim() && totalResults === 0 && (
            <div className="py-12 text-center space-y-2">
              <p className="text-base font-semibold text-slate-200">No cricket results found</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No matches, teams, or series matched &ldquo;{query}&rdquo;. Try searching for &ldquo;India&rdquo;, &ldquo;Australia&rdquo;, &ldquo;Champions Trophy&rdquo;, or &ldquo;T20&rdquo;.
              </p>
            </div>
          )}

          {/* Initial Quick Suggestions when empty query */}
          {!query.trim() && (
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['India', 'Australia', 'Pakistan', 'Champions Trophy', 'IPL 2026', 'T20', 'Test Cricket'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => handleQueryChange(term)}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400 transition-all"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* Matches Section */}
          {results.matches.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-rose-400" />
                  Matches ({results.matches.length})
                </span>
              </div>
              <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-[#080E1A]">
                {results.matches.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectMatch(m.id)}
                    className="w-full flex items-center justify-between p-3.5 text-left hover:bg-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-1.5">
                        <TeamBadge team={m.teams.home} size="xs" />
                        <TeamBadge team={m.teams.away} size="xs" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors">
                          {m.shortTitle} • <span className="text-xs text-slate-400 font-normal">{m.competition}</span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                          <MapPin className="h-3 w-3 text-slate-500" />
                          <span>{m.venue.name}, {m.venue.city}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <StatusBadge status={m.status} size="sm" />
                      <ArrowRight className="h-4 w-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Competitions Section */}
          {results.competitions.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  Tournaments & Series ({results.competitions.length})
                </span>
              </div>
              <div className="divide-y divide-white/5 rounded-xl border border-white/5 bg-[#080E1A]">
                {results.competitions.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectSeries(c.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-400">
                        {c.format} • {c.teamsCount} Teams • Season {c.season}
                      </div>
                    </div>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      {c.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Teams Section */}
          {results.teams.length > 0 && (
            <div className="space-y-2.5">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Teams ({results.teams.length})
              </p>
              <div className="grid grid-cols-2 gap-2">
                {results.teams.map((t) => (
                  <div
                    key={t.code}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/5 bg-[#080E1A]"
                  >
                    <span className="h-7 w-7 flex items-center justify-center rounded-lg bg-emerald-500/20 border border-emerald-500/40 font-mono text-xs font-bold text-emerald-300">
                      {t.code}
                    </span>
                    <div>
                      <div className="text-xs font-semibold text-white">{t.name}</div>
                      <div className="text-[10px] text-slate-400">{t.country}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-white/10 bg-[#080E1A]/80 px-4 py-2.5 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>Navigation:</span>
            <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">
              Esc to close
            </kbd>
          </div>
          <span className="text-[11px] text-emerald-400/80 font-mono">CricLive Instant Match Search</span>
        </div>
      </div>
    </div>
  );
}
