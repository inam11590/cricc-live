'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring if configured
    console.error('CricLive application error:', error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center space-y-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <div className="space-y-2">
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
          Cricket Telemetry Disrupted
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          An unexpected error occurred while rendering the match center. Our score monitoring system has logged this incident.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={reset}
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-black hover:bg-emerald-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Retry Connection</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
        >
          <Home className="h-4 w-4" />
          <span>Return to Match Center</span>
        </Link>
      </div>
    </div>
  );
}
