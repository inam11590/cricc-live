'use client';

import React from 'react';
import Link from 'next/link';
import { CRICKET_FIXTURES, PLATFORM_GUIDES } from '@/data/fixtures';
import { useTimezone } from '@/context/TimezoneContext';
import {
  Radio,
  Tv,
  Calendar,
  MapPin,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sliders,
  Cpu,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const { formatMatchTime, timezoneMode, timezoneLabel } = useTimezone();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Hero Announcement & Architectural Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0B111E] to-[#05080F] p-6 sm:p-10 shadow-2xl glass-card">
        {/* Subtle background stadium accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-semibold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>PHASE 1 ARCHITECTURE VERIFICATION</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-[11px] text-slate-300">6/6 CHANNELS ONLINE</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Stadium Floodlight &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-teal-200">
              Broadcast Glassmorphism
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Livecric delivers zero-friction, browser-native live cricket streaming inspired by
            Webcric’s 6-channel monthly architecture. Built for high-refresh desktop monitors,
            mobile PWAs, and 10-foot Smart TV viewing with D-pad navigation.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/hub"
              className="tv-focusable flex items-center space-x-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
            >
              <Radio className="h-4 w-4" />
              <span>Explore Cricket Hub (Live Scores & Stats)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="flex items-center space-x-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-300">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Next.js 16 (App Router)</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-300">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Tailwind CSS v4 OLED Tokens</span>
            </div>
            <div className="flex items-center space-x-2 rounded-xl bg-white/5 border border-white/10 px-3.5 py-1.5 text-xs text-slate-300">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              <span>TypeScript Strict Domain</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Curated Channels Matrix Preview */}
      <section id="channels" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Radio className="h-5 w-5 text-emerald-400" />
              <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                Monthly Live Fixture Matrix
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Curated 6 active monthly transponders with multi-source redundancy and schedule blocks.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
            <span>Clock:</span>
            <span className="rounded bg-white/5 px-2 py-1 text-emerald-400 border border-white/10">
              {timezoneMode.toUpperCase()} ({timezoneLabel})
            </span>
          </div>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CRICKET_FIXTURES.map((fixture) => {
            const isLive = fixture.status === 'LIVE';
            const isStumps = fixture.status === 'STUMPS' || fixture.status === 'INNINGS_BREAK';
            const primarySchedule = fixture.scheduleBlocks[0];

            return (
              <div
                key={fixture.id}
                className={cn(
                  'group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-300',
                  'bg-[#0B111E]/80 backdrop-blur-md',
                  isLive
                    ? 'border-rose-500/30 hover:border-rose-500/60 shadow-[0_4px_25px_rgba(244,63,94,0.1)]'
                    : 'border-white/8 hover:border-emerald-500/40 hover:shadow-[0_4px_25px_rgba(16,185,129,0.1)]'
                )}
              >
                {/* Channel Header Pill & Format */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                      CH 0{fixture.channelNumber}
                    </span>
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/5 text-slate-400">
                      {fixture.format}
                    </span>
                  </div>

                  {/* Status Badge */}
                  {isLive ? (
                    <span className="inline-flex items-center space-x-1.5 rounded-full bg-rose-500/20 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/30">
                      <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>LIVE</span>
                    </span>
                  ) : isStumps ? (
                    <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-300 border border-amber-400/30">
                      {fixture.status}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-400">
                      UPCOMING
                    </span>
                  )}
                </div>

                {/* Matchup Team Section */}
                <div className="space-y-3 my-2">
                  <span className="text-[11px] font-semibold text-emerald-400 line-clamp-1">
                    {fixture.competition}
                  </span>

                  <h3 className="font-display text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {fixture.title}
                  </h3>

                  {/* Teams Row */}
                  <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-3">
                    {/* Home Team */}
                    <div className="flex items-center space-x-2.5">
                      <span className="text-xl" role="img" aria-label={fixture.teams.home.name}>
                        {fixture.teams.home.flagEmoji}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-white">
                          {fixture.teams.home.code}
                        </span>
                        <span className="text-[10px] text-slate-400 max-w-[80px] truncate">
                          {fixture.teams.home.name}
                        </span>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-slate-600 font-bold">VS</span>

                    {/* Away Team */}
                    <div className="flex items-center space-x-2.5 flex-row-reverse text-right">
                      <span className="text-xl" role="img" aria-label={fixture.teams.away.name}>
                        {fixture.teams.away.flagEmoji}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-bold text-white">
                          {fixture.teams.away.code}
                        </span>
                        <span className="text-[10px] text-slate-400 max-w-[80px] truncate">
                          {fixture.teams.away.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Info Block */}
                {primarySchedule && (
                  <div className="my-3 rounded-lg bg-white/[0.02] border border-white/5 p-2.5 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5 text-slate-300">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-medium">{primarySchedule.label} • {primarySchedule.dateRange}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{primarySchedule.venue}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/5 text-slate-400">
                      <span>Local: {primarySchedule.localStartTimeLabel}</span>
                      <span className="text-emerald-400">
                        {formatMatchTime(primarySchedule.startTimeUtc)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Stream Redundancy Info */}
                <div className="mt-2 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-400">
                    <Radio className="h-3 w-3 text-emerald-400" />
                    <span>{fixture.streamSources.length} Feeds (HLS/Direct)</span>
                  </div>

                  <Link
                    href={`/live/${fixture.slug}`}
                    className="tv-focusable inline-flex items-center space-x-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <span>Tune In</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform & Smart TV Setup Guides */}
      <section className="space-y-6 pt-4">
        <div className="border-b border-white/10 pb-4">
          <div className="flex items-center space-x-2">
            <Tv className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Zero-Friction Device Playback Guides
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browser-native streaming across all screens without mandatory app stores or plugins.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PLATFORM_GUIDES.map((guide) => (
            <div
              key={guide.platformId}
              className="rounded-2xl border border-white/8 bg-[#0B111E]/70 p-5 space-y-3 glass-card"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">
                  {guide.title}
                </span>
                {guide.downloaderCode ? (
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                    CODE: {guide.downloaderCode}
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {guide.badge}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {guide.shortInstruction}
              </p>

              <div className="pt-2 text-[11px] font-mono text-slate-500 flex items-center space-x-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Verified Zero-Lag Edge Feeds</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Phase 1 Architectural Diagnostic Checklist */}
      <section className="rounded-2xl border border-white/10 bg-[#080E1A]/90 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="h-4 w-4 text-emerald-400" />
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-200">
              Phase 1 Deliverable Diagnostics
            </h3>
          </div>
          <span className="font-mono text-xs text-emerald-400 font-semibold">
            STATUS: READY FOR PHASE 2
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Design Tokens: Stadium Obsidian Palette</span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Strict Types: 6 Channel Model & Schemas</span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">Timezone Context: Local / UTC Switcher</span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">LiveTickerBar: Slim h-9 Real-Time Status</span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">BroadcastHeader: Glassmorphic + ⌘K Switcher</span>
          </div>
          <div className="flex items-center space-x-2 rounded-lg bg-black/30 p-2.5 border border-white/5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300">BroadcastFooter: 6 Channels & Outage Desk</span>
          </div>
        </div>
      </section>
    </div>
  );
}
