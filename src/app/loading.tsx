import React from 'react';

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12 animate-pulse" aria-label="Loading cricket data">
      {/* Hero Skeleton */}
      <div className="h-72 rounded-3xl border border-white/5 bg-[#0B111E]/60 p-8 space-y-4">
        <div className="h-6 w-48 rounded-full bg-white/10" />
        <div className="h-12 w-3/4 rounded-xl bg-white/10" />
        <div className="h-4 w-1/2 rounded-lg bg-white/5" />
        <div className="flex gap-4 pt-4">
          <div className="h-10 w-36 rounded-xl bg-emerald-500/20" />
          <div className="h-10 w-36 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* Featured Match Skeleton */}
      <div className="h-64 rounded-3xl border border-white/5 bg-[#0B111E]/40 p-6 space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-32 rounded bg-white/10" />
          <div className="h-5 w-20 rounded-full bg-rose-500/20" />
        </div>
        <div className="grid grid-cols-2 gap-8 py-4">
          <div className="h-16 rounded-xl bg-white/5" />
          <div className="h-16 rounded-xl bg-white/5" />
        </div>
        <div className="h-12 rounded-xl bg-white/5" />
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="h-48 rounded-2xl border border-white/5 bg-[#0B111E]/40 p-5 space-y-3">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-10 rounded bg-white/5" />
            <div className="h-10 rounded bg-white/5" />
            <div className="h-8 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
