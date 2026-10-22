import React from 'react';
import Link from 'next/link';
import { cricketService } from '@/services/cricketService';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedMatchCard } from '@/components/matches/FeaturedMatchCard';
import { MatchCenterFilter } from '@/components/matches/MatchCenterFilter';
import { TournamentsSection } from '@/components/home/TournamentsSection';
import { CricketFormatsSection } from '@/components/home/CricketFormatsSection';
import { EditorialNewsSection } from '@/components/home/EditorialNewsSection';
import { Radio, Calendar, ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const [featuredMatch, allMatches, competitions, editorials] = await Promise.all([
    cricketService.getFeaturedMatch(),
    cricketService.getMatches(),
    cricketService.getCompetitions(),
    cricketService.getEditorials(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-16">
      {/* SECTION 1: HERO SECTION */}
      <HeroSection />

      {/* SECTION 2: FEATURED LIVE MATCH */}
      {featuredMatch && (
        <section aria-labelledby="featured-match-heading" className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-rose-500 animate-pulse" />
              <h2
                id="featured-match-heading"
                className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white"
              >
                Featured Marquee Clash
              </h2>
            </div>
            <Link
              href={`/matches/${featuredMatch.id}`}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>Full Match Center</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <FeaturedMatchCard match={featuredMatch} />
        </section>
      )}

      {/* SECTION 3: INTERACTIVE MATCH-CENTER FILTERS & LISTINGS */}
      <section aria-labelledby="match-center-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <h2
                id="match-center-heading"
                className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white"
              >
                Match Center &amp; Live Fixtures
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Filter across live ongoing encounters, upcoming scheduled games, and verified recent results.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Live ({allMatches.filter((m) => m.status === 'LIVE' || m.status === 'STUMPS').length})
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Upcoming ({allMatches.filter((m) => m.status === 'UPCOMING').length})
            </span>
          </div>
        </div>

        {/* Stateful Client-Side Filter & Card Grid */}
        <MatchCenterFilter initialMatches={allMatches} defaultStatus="ALL" />
      </section>

      {/* SECTION 4: TOURNAMENTS & SERIES */}
      <TournamentsSection competitions={competitions} />

      {/* SECTION 5: CRICKET FORMATS SHOWCASE */}
      <CricketFormatsSection />

      {/* SECTION 6: EDITORIAL DESK & TACTICAL PREVIEWS */}
      <EditorialNewsSection editorials={editorials} />
    </div>
  );
}
