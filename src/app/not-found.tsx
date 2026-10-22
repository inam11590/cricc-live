import React from 'react';
import Link from 'next/link';
import { Radio, Calendar, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-8">
      <div className="space-y-3">
        <span className="font-mono text-xs font-bold text-emerald-400 tracking-widest uppercase">
          404 — Match or Page Not Found
        </span>
        <h1 className="font-display text-3xl sm:text-5xl font-black text-white tracking-tight">
          Fixture Off the Scoreboard
        </h1>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          The cricket fixture, tournament, or page you requested does not exist or has been archived.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
        >
          <Home className="h-4 w-4" />
          <span>Go to Home Match Center</span>
        </Link>
        <Link
          href="/live"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all"
        >
          <Radio className="h-4 w-4 text-rose-400" />
          <span>Browse Live Scores</span>
        </Link>
        <Link
          href="/schedule"
          className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/10 transition-all"
        >
          <Calendar className="h-4 w-4 text-blue-400" />
          <span>Upcoming Schedule</span>
        </Link>
      </div>
    </div>
  );
}
