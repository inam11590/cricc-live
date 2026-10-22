import React from 'react';
import Link from 'next/link';
import { Radio, Calendar, ArrowRight } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F172A] via-[#0B111E] to-[#05080F] p-6 sm:p-10 lg:p-12 shadow-2xl glass-card">
      {/* Stadium Floodlight CSS Glow & Pitch Vector Motif */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -mb-20 h-64 w-64 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

      {/* Abstract Cricket Pitch Geometry in background */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 hidden xl:block pointer-events-none select-none">
        <svg width="340" height="340" viewBox="0 0 200 200" fill="none">
          {/* Pitch rectangle */}
          <rect x="70" y="20" width="60" height="160" rx="4" stroke="#10B981" strokeWidth="2" strokeDasharray="4 2" />
          {/* Bowling crease lines */}
          <line x1="60" y1="40" x2="140" y2="40" stroke="#10B981" strokeWidth="2" />
          <line x1="60" y1="160" x2="140" y2="160" stroke="#10B981" strokeWidth="2" />
          {/* Stumps */}
          <circle cx="90" cy="35" r="2.5" fill="#10B981" />
          <circle cx="100" cy="35" r="2.5" fill="#10B981" />
          <circle cx="110" cy="35" r="2.5" fill="#10B981" />
          <circle cx="90" cy="165" r="2.5" fill="#10B981" />
          <circle cx="100" cy="165" r="2.5" fill="#10B981" />
          <circle cx="110" cy="165" r="2.5" fill="#10B981" />
          {/* Popping crease */}
          <line x1="65" y1="50" x2="135" y2="50" stroke="#10B981" strokeWidth="1.5" />
          <line x1="65" y1="150" x2="135" y2="150" stroke="#10B981" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 max-w-3xl space-y-6">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3.5 py-1 text-xs font-semibold text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="font-mono tracking-wider uppercase text-[11px]">CRICLIVE LIVE MATCH CENTER</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">Phase 1 Production Release</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15]">
          Live Cricket Scores &amp;{' '}
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300">
            Real-Time Analytics
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl">
          Follow live ball-by-ball scorecards, tournament schedules, recent results, and ICC rankings with a modern high-density broadcast design engineered for cricket enthusiasts and analysts worldwide.
        </p>

        {/* Primary and Secondary Actions */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <Link
            href="/live"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Radio className="h-4 w-4" />
            <span>Explore Live Matches</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href="/schedule"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:border-white/30 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <Calendar className="h-4 w-4 text-emerald-400" />
            <span>View Match Schedule</span>
          </Link>
        </div>

        {/* Cricket Telemetry Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="p-2.5 rounded-xl border border-white/5 bg-white/5">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Featured Event</span>
            <span className="text-white font-bold truncate block">Champions Trophy</span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/5 bg-white/5">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Longest Format</span>
            <span className="text-white font-bold truncate block">WTC Cycle 2025-27</span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/5 bg-white/5">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">T20 Franchise</span>
            <span className="text-white font-bold truncate block">IPL 2026 Ready</span>
          </div>

          <div className="p-2.5 rounded-xl border border-white/5 bg-white/5">
            <span className="text-slate-500 block text-[10px] font-mono uppercase">Global Standings</span>
            <span className="text-white font-bold truncate block">Official ICC Rankings</span>
          </div>
        </div>
      </div>
    </section>
  );
}
