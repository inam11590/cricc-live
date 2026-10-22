import React from 'react';

export default function MatchDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse" aria-label="Loading scorecard telemetry">
      <div className="h-4 w-40 rounded bg-white/10" />

      {/* Match Banner Skeleton */}
      <div className="h-72 rounded-3xl border border-white/5 bg-[#0B111E]/60 p-8 space-y-6">
        <div className="flex justify-between">
          <div className="h-5 w-48 rounded bg-white/10" />
          <div className="h-5 w-20 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-8 py-4">
          <div className="h-20 rounded-2xl bg-white/5" />
          <div className="h-20 rounded-2xl bg-white/5" />
        </div>
        <div className="h-12 rounded-xl bg-white/5" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-white/10 pb-2">
        <div className="h-8 w-28 rounded-lg bg-emerald-500/20" />
        <div className="h-8 w-28 rounded-lg bg-white/5" />
        <div className="h-8 w-28 rounded-lg bg-white/5" />
      </div>

      {/* Scorecard Table Skeleton */}
      <div className="h-96 rounded-2xl border border-white/5 bg-[#0B111E]/40 p-6 space-y-4">
        <div className="h-6 w-48 rounded bg-white/10" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 rounded bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}
