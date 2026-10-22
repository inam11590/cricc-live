import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cricketService } from '@/services/cricketService';
import { ScorecardShell } from '@/components/scorecard/ScorecardShell';
import { CricketMatch } from '@/types/cricket';

interface MatchPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function resolveMatch(id: string): Promise<CricketMatch | null> {
  const match = await cricketService.getMatchById(id);
  if (match) return match;
  return await cricketService.getMatchBySlug(id);
}

export async function generateStaticParams() {
  const matches = await cricketService.getMatches();
  return matches.map((m) => ({
    id: m.id,
  }));
}

export async function generateMetadata({ params }: MatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const match = await resolveMatch(id);

  if (!match) {
    return {
      title: 'Match Not Found | CricLive Match Center',
      description: 'The requested cricket match fixture was not found on CricLive.',
    };
  }

  const formatText = match.format ? `[${match.format}] ` : '';
  const statusSummary = match.statusText ? ` - ${match.statusText}` : '';

  return {
    title: `${formatText}${match.title} Live Scorecard & Match Center | CricLive`,
    description: `${match.shortTitle} — ${match.competition}${statusSummary} at ${match.venue.name}, ${match.venue.city}. Official ball-by-ball commentary, player statistics, and live match center.`,
    openGraph: {
      title: `${match.title} Live Scorecard | CricLive`,
      description: `${match.competition} - ${match.statusText} at ${match.venue.name}.`,
    },
  };
}

export default async function MatchDetailPage({ params }: MatchPageProps) {
  const { id } = await params;
  const [match, allMatches] = await Promise.all([
    resolveMatch(id),
    cricketService.getMatches(),
  ]);

  if (!match) {
    return notFound();
  }

  return <ScorecardShell key={match.id} match={match} allMatches={allMatches} />;
}
