'use client';

import React from 'react';
import Link from 'next/link';
import { CRICKET_FIXTURES } from '@/data/fixtures';
import { Radio, Mail, Tv, Smartphone, Apple, ShieldCheck, Wifi } from 'lucide-react';

export function BroadcastFooter() {
  return (
    <footer className="relative mt-20 border-t border-white/10 bg-[#04070E] text-slate-400">
      {/* Stadium top glow accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[1px] w-3/4 max-w-4xl bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Transponder Telemetry */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
                <Radio className="h-5 w-5 text-emerald-400" />
              </div>
              <span className="font-display text-xl font-black tracking-tight text-white">
                LIVE<span className="text-emerald-400">CRIC</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Ultra-low latency browser-native cricket broadcast platform. Engineered with zero-install HLS delivery, low CPU overhead, and native Smart TV compatibility.
            </p>

            {/* System Status Transponder Badge */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
              <div className="flex items-center space-x-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                </span>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  All 6 Livecric Transponders Operational
                </span>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Edge Delay: ~1.2s</span>
                <span>Uptime: 99.98%</span>
              </div>
            </div>
          </div>

          {/* Column 2: 6 Monthly Live Channels */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
              <Radio className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live Channels Matrix</span>
            </h3>

            <ul className="space-y-2.5 text-xs">
              {CRICKET_FIXTURES.map((fixture) => (
                <li key={fixture.id}>
                  <Link
                    href={`/live/${fixture.slug}`}
                    className="tv-focusable group flex items-center justify-between rounded-lg py-1 px-1.5 transition-colors hover:bg-white/5"
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <span className="font-mono text-[10px] font-bold text-slate-500 group-hover:text-emerald-400">
                        CH 0{fixture.channelNumber}
                      </span>
                      <span className="truncate text-slate-300 group-hover:text-white font-medium">
                        {fixture.shortTitle} • {fixture.title}
                      </span>
                    </div>

                    {fixture.status === 'LIVE' && (
                      <span className="shrink-0 rounded bg-rose-500/20 px-1 py-0.5 text-[9px] font-bold text-rose-400">
                        LIVE
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Device Setup Guides */}
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center space-x-2">
              <Tv className="h-3.5 w-3.5 text-emerald-400" />
              <span>Device Setup Guides</span>
            </h3>

            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/"
                  className="tv-focusable flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Wifi className="h-3.5 w-3.5 text-slate-400" />
                  <span>Home Broadcast Portal</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/setup/android"
                  className="tv-focusable flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Android PWA Installation</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/setup/iphone"
                  className="tv-focusable flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Apple className="h-3.5 w-3.5 text-slate-300" />
                  <span>iPhone / iPad AirPlay 2 Setup</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/setup/android-tv"
                  className="tv-focusable flex items-center justify-between text-slate-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Tv className="h-3.5 w-3.5 text-amber-400" />
                    <span>Android TV / Fire TV</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                    565656
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/setup/smart-tv"
                  className="tv-focusable flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Tv className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Samsung Tizen & LG webOS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Outage Notice & Feed Escalation */}
          <div className="space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 text-rose-400" />
              <span>Blank Channel Escalation</span>
            </h3>

            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2.5">
              <p className="text-xs text-slate-300 leading-relaxed">
                Experiencing a black screen, buffer loop, or geoblock? Our automated redundant uplink can switch feeds in 15 seconds.
              </p>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <span className="text-slate-400">NOC:</span>
                  <a
                    href="mailto:support@livecric.is"
                    className="hover:underline underline-offset-2"
                  >
                    support@livecric.is
                  </a>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-300">
                  <span className="text-slate-400">Backup:</span>
                  <a
                    href="mailto:livecric@protonmail.com"
                    className="hover:underline underline-offset-2"
                  >
                    livecric@protonmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Architectural Banner */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>
              Livecric © 2026. Browser-Native Streaming Architecture. Free & Open Access.
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="font-mono text-[10px] text-slate-400">
              Protocol: HLS/fMP4 Adaptive
            </span>
            <span>•</span>
            <span className="text-slate-400">Zero Trackers</span>
            <span>•</span>
            <span className="text-slate-400">Smart TV Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
