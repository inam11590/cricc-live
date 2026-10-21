'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CRICKET_FIXTURES } from '@/data/fixtures';
import { Search, Radio, ArrowRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChannelJumpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChannelJumpModal({ isOpen, onClose }: ChannelJumpModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = CRICKET_FIXTURES.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.competition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `ch ${item.channelNumber}`.includes(searchQuery.toLowerCase())
  );

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (filtered.length === 0 ? 0 : (prev + 1) % filtered.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          filtered.length === 0 ? 0 : (prev - 1 + filtered.length) % filtered.length
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filtered[selectedIndex];
        if (selected) {
          router.push(`/live/${selected.slug}`);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#0B111E] shadow-2xl overflow-hidden glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3 bg-[#05080F]/90">
          <Search className="h-5 w-5 text-emerald-400 mr-3 shrink-0" />
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type channel # or match (e.g. '3', 'India', 'Test', 'AUS')..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="tv-focusable text-slate-400 hover:text-white p-1 rounded-lg ml-2"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Channels List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-400">
              No matching live channels found.
            </div>
          ) : (
            filtered.map((fixture, idx) => {
              const isSelected = idx === selectedIndex;
              const isLive = fixture.status === 'LIVE';

              return (
                <div
                  key={fixture.id}
                  onClick={() => {
                    router.push(`/live/${fixture.slug}`);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={cn(
                    'group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all',
                    isSelected
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-white'
                      : 'hover:bg-white/5 border border-transparent text-slate-300'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={cn(
                        'font-mono text-xs font-bold px-2 py-0.5 rounded-md border',
                        isSelected
                          ? 'bg-emerald-500 text-black border-emerald-400'
                          : 'bg-white/5 text-emerald-400 border-white/10'
                      )}
                    >
                      CH 0{fixture.channelNumber}
                    </span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-slate-100 group-hover:text-emerald-400">
                          {fixture.title}
                        </span>
                        {isLive && (
                          <span className="inline-flex items-center space-x-1 rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-bold text-rose-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            <span>LIVE</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1">
                        {fixture.competition} • {fixture.format}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-slate-400 group-hover:text-emerald-400">
                    <span className="hidden sm:inline font-mono text-[11px]">
                      {fixture.teams.home.code} vs {fixture.teams.away.code}
                    </span>
                    <ArrowRight className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 bg-[#05080F]/90 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <div className="flex items-center space-x-1 text-emerald-400">
            <Radio className="h-3 w-3 animate-pulse" />
            <span>6 Transponders Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
