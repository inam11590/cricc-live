'use client';

import React from 'react';

export function ScorecardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="h-64 rounded-3xl bg-white/5 border border-white/10 p-6 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="h-4 w-48 rounded bg-white/10" />
          <div className="h-6 w-20 rounded-full bg-white/10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-20 rounded-2xl bg-white/10" />
          <div className="h-20 rounded-2xl bg-white/10" />
        </div>
        <div className="h-10 rounded-xl bg-white/10" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-4 border-b border-white/10 pb-2">
        <div className="h-8 w-28 rounded bg-white/10" />
        <div className="h-8 w-28 rounded bg-white/10" />
        <div className="h-8 w-28 rounded bg-white/10" />
      </div>

      {/* Table Skeleton */}
      <div className="h-96 rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
        <div className="h-6 w-40 rounded bg-white/10" />
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 rounded bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
