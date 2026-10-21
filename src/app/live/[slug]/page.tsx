import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CRICKET_FIXTURES, getFixtureBySlug } from '@/data/fixtures';
import { BroadcastPlayer } from '@/components/player/BroadcastPlayer';
import {
  Calendar,
  MapPin,
  Clock,
  ArrowLeft,
  Tv,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CRICKET_FIXTURES.map((fixture) => ({
    slug: fixture.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fixture = getFixtureBySlug(slug);

  if (!fixture) {
    return {
      title: 'Channel Not Found — Livecric',
    };
  }

  return {
    title: `Watch ${fixture.title} Live Stream — Channel 0${fixture.channelNumber} | Livecric`,
    description: `Watch ${fixture.title} live in full HD 1080p browser-native stream on Channel 0${fixture.channelNumber}. Zero registration, mobile PWA, and Smart TV ready.`,
  };
}

export default async function LiveChannelPage({ params }: PageProps) {
  const { slug } = await params;
  const fixture = getFixtureBySlug(slug);

  if (!fixture) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Top Breadcrumb & Quick Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="tv-focusable inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Channel Matrix</span>
        </Link>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <span className="text-slate-500">Transponder:</span>
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-emerald-400 font-bold">
            CHANNEL 0{fixture.channelNumber}
          </span>
        </div>
      </div>

      {/* Main Broadcast Player HUD */}
      <BroadcastPlayer fixture={fixture} />

      {/* Matchup & Scorecard Banner */}
      <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 glass-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {fixture.competition}
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-mono text-xs text-slate-400 font-semibold">
                {fixture.format}
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              {fixture.title}
            </h1>
          </div>

          {/* Quick TV Casting Hint */}
          <div className="flex items-center space-x-3">
            <Link
              href="/setup/android-tv"
              className="tv-focusable flex items-center space-x-2 rounded-xl bg-amber-400/10 border border-amber-400/30 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-400/20 transition-all"
            >
              <Tv className="h-4 w-4" />
              <span>Smart TV Downloader: 565656</span>
            </Link>
          </div>
        </div>

        {/* Teams Matchup Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Home Team Card */}
          <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl" role="img" aria-label={fixture.teams.home.name}>
                {fixture.teams.home.flagEmoji}
              </span>
              <div>
                <span className="font-display text-base font-bold text-white">
                  {fixture.teams.home.name}
                </span>
                <span className="block font-mono text-xs text-slate-400">
                  Code: {fixture.teams.home.code}
                </span>
              </div>
            </div>
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: fixture.teams.home.accentColor }}
            />
          </div>

          {/* Away Team Card */}
          <div className="flex items-center justify-between rounded-xl bg-black/40 border border-white/5 p-4">
            <div className="flex items-center space-x-3">
              <span className="text-3xl" role="img" aria-label={fixture.teams.away.name}>
                {fixture.teams.away.flagEmoji}
              </span>
              <div>
                <span className="font-display text-base font-bold text-white">
                  {fixture.teams.away.name}
                </span>
                <span className="block font-mono text-xs text-slate-400">
                  Code: {fixture.teams.away.code}
                </span>
              </div>
            </div>
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: fixture.teams.away.accentColor }}
            />
          </div>
        </div>

        {/* Editorial Summary */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Series Overview & Broadcast Intel
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {fixture.editorialSummary}
          </p>
        </div>
      </div>

      {/* Series Schedule & Venues Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 glass-card space-y-4">
        <div className="flex items-center space-x-2 border-b border-white/10 pb-4">
          <Calendar className="h-5 w-5 text-emerald-400" />
          <h2 className="font-display text-lg font-bold text-white">
            Confirmed Match Schedule Blocks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {fixture.scheduleBlocks.map((block, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white/[0.02] border border-white/5 p-4 space-y-2 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-white">
                  {block.label}
                </span>
                <span className="font-mono text-xs text-emerald-400 font-semibold">
                  {block.dateRange}
                </span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="truncate">{block.venue}</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-400 pt-1 border-t border-white/5">
                <Clock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                <span>{block.localStartTimeLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
