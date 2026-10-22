'use client';

import React from 'react';
import { CricketMatch } from '@/types/cricket';
import { Shield, MapPin, Sun, UserCheck } from 'lucide-react';

interface MatchInfoTabProps {
  match: CricketMatch;
}

export function MatchInfoTab({ match }: MatchInfoTabProps) {
  const scorecard = match.scorecard;
  const officials = scorecard?.officials;
  const conditions = scorecard?.playingConditions;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Column 1: Match & Playing Conditions */}
      <div className="space-y-6">
        {/* Match Details */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Shield className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Match Specifications
            </h3>
          </div>

          <dl className="divide-y divide-white/5 text-xs">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Match:</dt>
              <dd className="font-semibold text-white">{match.title}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Tournament:</dt>
              <dd className="font-semibold text-white">{match.competition}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Format:</dt>
              <dd className="font-mono font-semibold text-emerald-400">{match.format}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Status:</dt>
              <dd className="font-mono text-slate-200">{match.status}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Toss:</dt>
              <dd className="text-slate-200 text-right max-w-[260px]">
                {scorecard?.toss || 'Toss not yet recorded'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Playing Conditions */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <Sun className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Playing Conditions
            </h3>
          </div>

          {conditions ? (
            <dl className="divide-y divide-white/5 text-xs">
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Match Type:</dt>
                <dd className="font-medium text-white">
                  {conditions.matchType || `${match.format} Standard Regulations`}
                </dd>
              </div>
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Balls Per Over:</dt>
                <dd className="font-mono text-slate-200">
                  {conditions.ballsPerOver || 6} legal deliveries
                </dd>
              </div>
              {(conditions.pitchCondition || match.venue.pitchType) && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">Pitch Condition:</dt>
                  <dd className="text-slate-300 text-right max-w-[260px]">
                    {conditions.pitchCondition || match.venue.pitchType}
                  </dd>
                </div>
              )}
              {conditions.weatherCondition && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">Weather &amp; Climate:</dt>
                  <dd className="text-slate-300 text-right max-w-[260px]">
                    {conditions.weatherCondition}
                  </dd>
                </div>
              )}
              {conditions.floodlights !== undefined && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">Floodlights:</dt>
                  <dd className="font-mono text-emerald-400">
                    {conditions.floodlights ? 'Active (Day/Night match)' : 'Natural light'}
                  </dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-xs text-slate-500 font-mono">
              Playing conditions not supplied by provider for this fixture. Standard {match.format} rules apply.
            </p>
          )}
        </div>
      </div>

      {/* Column 2: Venue & Officials */}
      <div className="space-y-6">
        {/* Venue Details */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <MapPin className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Venue &amp; Stadium
            </h3>
          </div>

          <dl className="divide-y divide-white/5 text-xs">
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">Stadium:</dt>
              <dd className="font-semibold text-white">{match.venue.name}</dd>
            </div>
            <div className="py-2.5 flex justify-between">
              <dt className="text-slate-400">City &amp; Country:</dt>
              <dd className="text-slate-200">
                {match.venue.city}, {match.venue.country || 'International'}
              </dd>
            </div>
            {match.venue.capacity && (
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Spectator Capacity:</dt>
                <dd className="font-mono text-slate-300">
                  {match.venue.capacity.toLocaleString()} seats
                </dd>
              </div>
            )}
            {match.venue.pitchType && (
              <div className="py-2.5 flex justify-between">
                <dt className="text-slate-400">Pitch Profile:</dt>
                <dd className="text-emerald-400 font-medium">{match.venue.pitchType}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Match Officials */}
        <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <UserCheck className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Match Officials
            </h3>
          </div>

          {officials ? (
            <dl className="divide-y divide-white/5 text-xs">
              {officials.umpires && officials.umpires.length > 0 && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">On-field Umpires:</dt>
                  <dd className="font-semibold text-white">
                    {officials.umpires.join(', ')}
                  </dd>
                </div>
              )}
              {officials.thirdUmpire && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">Third Umpire (TV):</dt>
                  <dd className="text-slate-200">{officials.thirdUmpire}</dd>
                </div>
              )}
              {officials.matchReferee && (
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-400">Match Referee:</dt>
                  <dd className="font-semibold text-amber-300">{officials.matchReferee}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-xs text-slate-500 font-mono">
              Match officials list not supplied by provider for this fixture.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
