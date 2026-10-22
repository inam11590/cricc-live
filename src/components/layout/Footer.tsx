import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-[#05080F] text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-[#0B111E] border border-emerald-500/30">
                <span className="font-display font-black text-emerald-400 text-lg">C</span>
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight">
                CRIC<span className="text-emerald-400">LIVE</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Professional cricket live-scores, precision telemetry, and match-center analytics platform built for fans, analysts, and followers of world cricket.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400/90 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Phase 1 Frontend Architecture</span>
            </div>
          </div>

          {/* Matches & Scores */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
              Match Center
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/live" className="hover:text-emerald-400 transition-colors">
                  Live Scores &amp; Commentary
                </Link>
              </li>
              <li>
                <Link href="/schedule" className="hover:text-emerald-400 transition-colors">
                  Match Schedule &amp; Fixtures
                </Link>
              </li>
              <li>
                <Link href="/results" className="hover:text-emerald-400 transition-colors">
                  Recent Results &amp; Scorecards
                </Link>
              </li>
              <li>
                <Link href="/series" className="hover:text-emerald-400 transition-colors">
                  Tournaments &amp; Bilateral Series
                </Link>
              </li>
              <li>
                <Link href="/rankings" className="hover:text-emerald-400 transition-colors">
                  ICC Team &amp; Player Rankings
                </Link>
              </li>
            </ul>
          </div>

          {/* Formats & Tournaments */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
              Cricket Formats
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-300">Test Cricket (5 Days / WTC)</span>
              </li>
              <li>
                <span className="text-slate-300">One Day Internationals (ODI)</span>
              </li>
              <li>
                <span className="text-slate-300">Twenty20 International (T20I)</span>
              </li>
              <li>
                <span className="text-slate-300">Franchise Leagues (IPL, BBL, PSL)</span>
              </li>
              <li>
                <span className="text-slate-300">Women&apos;s International Cricket</span>
              </li>
            </ul>
          </div>

          {/* Legal & Standards */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-slate-200 uppercase font-mono">
              Standards &amp; Policies
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">Terms of Service</span>
              </li>
              <li>
                <span className="text-slate-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-slate-400">Fair Use &amp; Data Attribution</span>
              </li>
              <li>
                <span className="text-slate-400">WCAG AA Accessibility Statement</span>
              </li>
            </ul>
            <div className="rounded-xl border border-white/5 bg-white/5 p-3 text-[11px] text-slate-400">
              <p>
                CricLive is an independent cricket product platform. All match names, tournament titles, and team trademarks belong to their respective boards and governing bodies.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 CricLive Network. Built for global cricket followers.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>TypeScript Strict</span>
            <span>•</span>
            <span>Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
