import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PLATFORM_GUIDES } from '@/data/fixtures';
import {
  Smartphone,
  Apple,
  Tv,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ platform: string }>;
}

export async function generateStaticParams() {
  return PLATFORM_GUIDES.map((guide) => ({
    platform: guide.platformId,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { platform } = await params;
  const guide = PLATFORM_GUIDES.find((g) => g.platformId === platform);

  if (!guide) {
    return {
      title: 'Guide Not Found — Livecric',
    };
  }

  return {
    title: `${guide.title} Setup Guide — Livecric Browser-Native Playback`,
    description: guide.shortInstruction,
  };
}

export default async function PlatformSetupPage({ params }: PageProps) {
  const { platform } = await params;
  const guide = PLATFORM_GUIDES.find((g) => g.platformId === platform);

  if (!guide) {
    notFound();
  }

  const isAndroidTV = platform === 'android-tv';
  const isAndroid = platform === 'android';
  const isIPhone = platform === 'iphone';
  const isSmartTV = platform === 'smart-tv';

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          href="/"
          className="tv-focusable inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Channel Matrix</span>
        </Link>
      </div>

      {/* Guide Header Banner */}
      <div className="rounded-3xl border border-white/10 bg-[#0B111E] p-6 sm:p-10 glass-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              {isAndroid && <Smartphone className="h-6 w-6" />}
              {isIPhone && <Apple className="h-6 w-6" />}
              {(isAndroidTV || isSmartTV) && <Tv className="h-6 w-6" />}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {guide.badge}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                {guide.title}
              </h1>
            </div>
          </div>

          {guide.downloaderCode && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block">
                Quick-Dial Downloader Code
              </span>
              <span className="font-mono text-3xl font-black text-amber-400 tracking-wider">
                {guide.downloaderCode}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          {guide.shortInstruction}
        </p>
      </div>

      {/* Step by Step Playback Walkthrough */}
      <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 sm:p-8 glass-card space-y-6">
        <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          <span>Step-by-Step Playback Instructions</span>
        </h2>

        <div className="space-y-4 text-sm text-slate-300">
          {isAndroid && (
            <>
              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  01
                </span>
                <p>
                  Open <strong className="text-white">Google Chrome</strong> or Brave on your Android phone and navigate to <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">https://livecric.is</code>.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  02
                </span>
                <p>
                  Tap the <strong className="text-white">three dots menu</strong> in the top-right corner and select <strong className="text-white">&ldquo;Install app&rdquo;</strong> or <strong className="text-white">&ldquo;Add to Home screen&rdquo;</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  03
                </span>
                <p>
                  Launch Livecric directly from your home screen. It will open as a native app with zero browser chrome, hardware-accelerated HLS video, and background audio support.
                </p>
              </div>
            </>
          )}

          {isIPhone && (
            <>
              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  01
                </span>
                <p>
                  Open <strong className="text-white">Apple Safari</strong> on your iPhone or iPad and visit <code className="text-emerald-400 bg-black/40 px-1.5 py-0.5 rounded">https://livecric.is</code>.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  02
                </span>
                <p>
                  Tap the <strong className="text-white">Share button</strong> (square with arrow pointing up) at the bottom toolbar, scroll down, and tap <strong className="text-white">&ldquo;Add to Home Screen&rdquo;</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded px-2 py-1">
                  03
                </span>
                <p>
                  Tap the Livecric icon to stream live cricket with native iOS Picture-in-Picture (PiP) and one-tap AirPlay 2 beaming to your Apple TV or Smart TV.
                </p>
              </div>
            </>
          )}

          {isAndroidTV && (
            <>
              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-400/30 rounded px-2 py-1">
                  01
                </span>
                <p>
                  On your Android TV, Google TV, or Amazon Fire TV Stick, launch the free <strong className="text-white">&ldquo;Downloader by AFTVnews&rdquo;</strong> app from the app store.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-400/30 rounded px-2 py-1">
                  02
                </span>
                <p>
                  In the URL / Search field, type the quick-dial code: <strong className="text-amber-400 font-mono text-base font-black">565656</strong> and press <strong className="text-white">Go</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 border border-amber-400/30 rounded px-2 py-1">
                  03
                </span>
                <p>
                  Livecric will launch directly in 10-foot television mode with full D-pad remote navigation and high-visibility focus borders.
                </p>
              </div>
            </>
          )}

          {isSmartTV && (
            <>
              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-400/30 rounded px-2 py-1">
                  01
                </span>
                <p>
                  Open the built-in browser on your TV (<strong className="text-white">Samsung Internet</strong> on Tizen or <strong className="text-white">Web Browser</strong> on LG webOS).
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-400/30 rounded px-2 py-1">
                  02
                </span>
                <p>
                  Type <code className="text-cyan-400 bg-black/40 px-1.5 py-0.5 rounded">https://livecric.is</code> and add the page to your TV browser Bookmarks.
                </p>
              </div>

              <div className="flex items-start space-x-3 rounded-xl bg-white/[0.02] border border-white/5 p-4">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-400/30 rounded px-2 py-1">
                  03
                </span>
                <p>
                  Press the Fullscreen button on any channel player to stream live match feeds with zero satellite latency.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
