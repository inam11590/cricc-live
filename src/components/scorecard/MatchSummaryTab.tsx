'use client';

import React from 'react';
import { CricketMatch } from '@/types/cricket';
import { Trophy, Award, FileText, CheckCircle2 } from 'lucide-react';

interface MatchSummaryTabProps {
  match: CricketMatch;
}

export function MatchSummaryTab({ match }: MatchSummaryTabProps) {
  const scorecard = match.scorecard;

  return (
    <div className="space-y-6">
      {/* Editorial Match Summary */}
      <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-5 sm:p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 border-b border-white/5 pb-3">
          <FileText className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Match Overview &amp; Editorial Summary
          </h3>
        </div>

        <p className="text-sm text-slate-200 leading-relaxed font-sans">
          {scorecard?.matchSummary ||
            match.statusText ||
            `${match.title} in the ${match.competition}. Status: ${match.status} at ${match.venue?.name || 'Stadium'}${match.venue?.city ? `, ${match.venue.city}` : ''}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Toss & Conditions */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Toss &amp; Decision
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 font-sans">
            {scorecard?.toss || 'Toss information not yet available for this fixture.'}
          </p>

          {match.statusText && (
            <div className="rounded-xl bg-white/5 border border-white/5 p-3 text-xs font-mono text-emerald-300">
              {match.statusText}
            </div>
          )}
        </div>

        {/* Player of the Match */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Trophy className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Player of the Match
            </h3>
          </div>

          {scorecard?.playerOfTheMatch ? (
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Award className="h-8 w-8 text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-white block">
                  {scorecard.playerOfTheMatch}
                </span>
                <span className="text-[11px] font-mono text-amber-300">
                  Match Award Recipient
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 font-mono">
              Player of the match will be announced upon conclusion of the match.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
