'use client';

import React from 'react';
import { CricketMatch } from '@/types/cricket';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

interface UpcomingMatchPreviewProps {
  match: CricketMatch;
}

export function UpcomingMatchPreview({ match }: UpcomingMatchPreviewProps) {
  const formattedStartTime = React.useMemo(() => {
    try {
      const d = new Date(match.startTimeUtc);
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'UTC',
      }).format(d) + ' UTC';
    } catch {
      return match.startTimeUtc;
    }
  }, [match.startTimeUtc]);

  return (
    <div className="space-y-6">
      {/* Hero Notice */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-[#0F172A] to-[#080E1A] p-6 sm:p-8 text-center space-y-4 shadow-xl">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
          <Clock className="h-3.5 w-3.5" />
          <span>FIXTURE SCHEDULED</span>
        </div>

        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Match Telemetry Starts at Toss
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          The toss is scheduled approximately 30 minutes prior to first ball. Full ball-by-ball commentary, player telemetry, and live scoreboard will activate automatically when play commences.
        </p>

        <div className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 font-mono text-xs text-slate-200">
          <Calendar className="h-4 w-4 text-emerald-400" />
          <span>{formattedStartTime}</span>
        </div>
      </div>

      {/* Head to Head & Stadium Environment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Users className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Matchup Profile
            </h4>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <span className="text-sm font-bold text-white block">{match.teams.home.name}</span>
              <span className="text-xs font-mono text-slate-400">{match.teams.home.code}</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400">VS</span>
            <div className="text-right">
              <span className="text-sm font-bold text-white block">{match.teams.away.name}</span>
              <span className="text-xs font-mono text-slate-400">{match.teams.away.code}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            {match.competition} • Format: <span className="font-mono text-emerald-400 font-bold">{match.format}</span>
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-lg">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Venue Environment
            </h4>
          </div>

          <dl className="divide-y divide-white/5 text-xs">
            <div className="py-2 flex justify-between">
              <dt className="text-slate-400">Stadium:</dt>
              <dd className="font-semibold text-white">{match.venue.name}</dd>
            </div>
            <div className="py-2 flex justify-between">
              <dt className="text-slate-400">Location:</dt>
              <dd className="text-slate-200">
                {match.venue.city}, {match.venue.country || 'International'}
              </dd>
            </div>
            {match.venue.pitchType && (
              <div className="py-2 flex justify-between">
                <dt className="text-slate-400">Pitch Report:</dt>
                <dd className="text-emerald-400 font-medium">{match.venue.pitchType}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
