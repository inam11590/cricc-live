'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tv, Smartphone, Apple, Search, Menu, X, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChannelJumpModal } from './ChannelJumpModal';

function subscribePlatform() {
  return () => {};
}

function getIsMac(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0;
}

function getIsMacServer(): boolean {
  return true;
}

export function BroadcastHeader() {
  const pathname = usePathname();
  const [isJumpOpen, setIsJumpOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Safe client platform subscription without setState in effect
  const isMac = useSyncExternalStore(subscribePlatform, getIsMac, getIsMacServer);

  // Global hotkey listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsJumpOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    {
      label: 'Live Channels (6)',
      href: '/#channels',
      icon: Radio,
      badge: '6 ON AIR',
      isActive: pathname === '/' || pathname.startsWith('/live'),
    },
    {
      label: 'Android',
      href: '/setup/android',
      icon: Smartphone,
      isActive: pathname === '/setup/android',
    },
    {
      label: 'iPhone / iPad',
      href: '/setup/iphone',
      icon: Apple,
      isActive: pathname === '/setup/iphone',
    },
    {
      label: 'Android TV',
      href: '/setup/android-tv',
      icon: Tv,
      badge: 'Code: 565656',
      badgeColor: 'gold',
      isActive: pathname === '/setup/android-tv',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#05080F]/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              href="/"
              className="tv-focusable group flex items-center space-x-3 rounded-xl p-1 transition-all"
            >
              {/* Stadium Floodlight & Seam Mark */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 via-emerald-950/40 to-[#05080F] p-2 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:border-emerald-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                >
                  {/* Outer Stadium Perimeter Ring */}
                  <circle
                    cx="16"
                    cy="16"
                    r="14"
                    stroke="#10B981"
                    strokeWidth="1.25"
                    strokeDasharray="2 2"
                    className="opacity-40"
                  />
                  {/* Pitch Seam Arch */}
                  <path
                    d="M8 22C11 14 21 14 24 22"
                    stroke="#10B981"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Seam stitches */}
                  <path d="M11.5 17.5L13 19.5" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 16L16 18.5" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20.5 17.5L19 19.5" stroke="#6EE7B7" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Floodlight Beacon Flare */}
                  <circle cx="16" cy="6.5" r="2.5" fill="#10B981" />
                  <path d="M16 3.5V1.5" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M12 5L10 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M20 5L22 3" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Wordmark & Pill */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-display text-xl sm:text-2xl font-black tracking-[-0.04em] text-white">
                    LIVE<span className="text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]">CRIC</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 tracking-wider">
                    v2.6 PRO
                  </span>
                </div>

                <div className="hidden sm:flex items-center space-x-1.5 text-[10px] tracking-wide text-slate-400">
                  <span className="font-semibold text-slate-300">BROWSER-NATIVE LIVE CRICKET</span>
                  <span>•</span>
                  <span className="text-emerald-400/90 font-medium">Free · No App Needed</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Center/Right: Primary Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'tv-focusable group relative flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold transition-all',
                    link.isActive
                      ? 'bg-white/8 text-white shadow-sm border border-white/10'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  )}
                >
                  <Icon className={cn('h-4 w-4', link.isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-emerald-400')} />
                  <span>{link.label}</span>

                  {link.badge && (
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-tight',
                        link.badgeColor === 'gold'
                          ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      )}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Channel Jump Trigger */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsJumpOpen(true)}
              className="tv-focusable flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition-all hover:border-emerald-500/40 hover:bg-white/10 hover:text-white"
              title="Jump to any cricket channel (⌘K or Ctrl+K)"
            >
              <Search className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Channel Jump</span>
              <kbd className="hidden sm:inline-flex items-center rounded border border-white/15 bg-black/40 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="tv-focusable md:hidden rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300 hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#05080F]/95 px-4 py-4 space-y-2 backdrop-blur-2xl">
            <div className="pb-2 border-b border-white/5">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                Broadcast Navigation
              </span>
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                    link.isActive
                      ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 font-mono text-[10px] font-bold',
                        link.badgeColor === 'gold'
                          ? 'bg-amber-400/20 text-amber-300'
                          : 'bg-emerald-500/20 text-emerald-400'
                      )}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsJumpOpen(true);
                }}
                className="w-full flex items-center justify-center space-x-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 py-2.5 text-sm font-semibold text-emerald-400"
              >
                <Search className="h-4 w-4" />
                <span>Search All 6 Channels</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Channel Jump Command Palette */}
      <ChannelJumpModal isOpen={isJumpOpen} onClose={() => setIsJumpOpen(false)} />
    </>
  );
}
