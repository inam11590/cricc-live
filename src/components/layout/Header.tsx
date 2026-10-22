'use client';

import React, { useState, useEffect, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Menu,
  X,
  Radio,
  Calendar,
  CheckCircle2,
  Trophy,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchModal } from '@/components/search/SearchModal';
import { DemoDataBadge } from '@/components/ui/DemoDataBadge';

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

export function Header() {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isMac = useSyncExternalStore(subscribePlatform, getIsMac, getIsMacServer);

  // Global hotkey listener for ⌘K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    {
      label: 'Home',
      href: '/',
      isActive: pathname === '/',
    },
    {
      label: 'Live Scores',
      href: '/live',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'rose',
      isActive: pathname === '/live',
    },
    {
      label: 'Schedule',
      href: '/schedule',
      icon: Calendar,
      isActive: pathname === '/schedule',
    },
    {
      label: 'Results',
      href: '/results',
      icon: CheckCircle2,
      isActive: pathname === '/results',
    },
    {
      label: 'Series',
      href: '/series',
      icon: Trophy,
      isActive: pathname === '/series',
    },
    {
      label: 'Rankings',
      href: '/rankings',
      icon: Award,
      isActive: pathname === '/rankings',
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-white/8 bg-[#05080F]/90 backdrop-blur-xl transition-all">
        {/* Top Telemetry & Demo Notice Bar */}
        <div className="border-b border-white/5 bg-[#080E1A]/60 px-4 py-1 sm:px-6 text-xs text-slate-400">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CRICLIVE MATCH CENTER
              </span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
                ICC Champions Trophy 2026 &amp; WTC Cycle Live
              </span>
            </div>

            <div className="flex items-center gap-2">
              <DemoDataBadge variant="subtle" />
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-6 lg:gap-8">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-xl p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="CricLive Home"
            >
              {/* Cricket Ball & Seam Mark */}
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 via-emerald-950/40 to-[#05080F] p-2 border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.25)] group-hover:border-emerald-400 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
                <svg
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-full w-full"
                  aria-hidden="true"
                >
                  {/* Outer Cricket Ball Perimeter */}
                  <circle
                    cx="16"
                    cy="16"
                    r="13"
                    className="stroke-emerald-400/80 group-hover:stroke-emerald-300"
                    strokeWidth="2"
                  />
                  {/* Cricket Seam Stitching Curve */}
                  <path
                    d="M9 7C14 11 14 21 9 25"
                    className="stroke-emerald-400"
                    strokeWidth="1.8"
                    strokeDasharray="2 1.5"
                  />
                  <path
                    d="M23 7C18 11 18 21 23 25"
                    className="stroke-emerald-400"
                    strokeWidth="1.8"
                    strokeDasharray="2 1.5"
                  />
                  {/* Core Speed Mark */}
                  <circle cx="16" cy="16" r="3" className="fill-emerald-400" />
                </svg>
              </div>

              {/* Wordmark */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-xl font-black tracking-tight text-white group-hover:text-emerald-300 transition-colors">
                    CRIC<span className="text-emerald-400">LIVE</span>
                  </span>
                  <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-mono font-bold text-emerald-400 uppercase">
                    PRO
                  </span>
                </div>
                <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase">
                  Match Center &amp; Scores
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400',
                      link.isActive
                        ? 'bg-white/10 text-white font-semibold shadow-inner'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {Icon && (
                      <Icon
                        className={cn(
                          'h-4 w-4',
                          link.badgeColor === 'rose'
                            ? 'text-rose-400 animate-pulse'
                            : 'text-slate-400'
                        )}
                        aria-hidden="true"
                      />
                    )}
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.2 font-mono text-[9px] font-bold text-rose-400 uppercase">
                        {link.badge}
                      </span>
                    )}
                    {link.isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search Control & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Interactive Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-white/10 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label="Open search modal (Cmd+K)"
            >
              <Search className="h-4 w-4 text-emerald-400" aria-hidden="true" />
              <span className="hidden sm:inline">Search matches, teams...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-white/15 bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
                {isMac ? '⌘K' : 'Ctrl+K'}
              </kbd>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-[#0B111E] px-4 py-4 space-y-2 animate-in slide-in-from-top-4 duration-200">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all',
                    link.isActive
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-4 w-4 text-slate-400" />}
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="rounded bg-rose-500/20 border border-rose-500/30 px-1.5 py-0.5 font-mono text-[10px] font-bold text-rose-400">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsSearchOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-2.5 text-xs font-semibold text-slate-200"
              >
                <Search className="h-4 w-4 text-emerald-400" />
                <span>Search Cricket Matches &amp; Teams</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Interactive Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
