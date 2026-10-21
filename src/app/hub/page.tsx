'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { PlayerProfile, BattingSummary, BowlingSummary } from '@/app/api/players/[player_name]/route';
import {
  Radio,
  Calendar,
  User,
  Users,
  Search,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Trophy,
  ArrowLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CricketHubPage() {
  const [activeTab, setActiveTab] = useState<'live' | 'schedule' | 'player' | 'compare'>('live');

  // Live Scores State
  const [liveScores, setLiveScores] = useState<string[]>([]);
  const [loadingLive, setLoadingLive] = useState(false);

  // Schedule State
  const [scheduleList, setScheduleList] = useState<string[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Player Search State
  const [playerSearchQuery, setPlayerSearchQuery] = useState('Virat Kohli');
  const [playerData, setPlayerData] = useState<PlayerProfile | null>(null);
  const [loadingPlayer, setLoadingPlayer] = useState(false);

  // Player Comparison State
  const [compareP1, setCompareP1] = useState('Virat Kohli');
  const [compareP2, setCompareP2] = useState('Babar Azam');
  const [comparisonData, setComparisonData] = useState<{
    player1: PlayerProfile;
    player2: PlayerProfile;
  } | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  // Fetch Live Scores
  const fetchLiveScores = async () => {
    setLoadingLive(true);
    try {
      const res = await fetch('/api/live');
      const data = await res.json();
      setLiveScores(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoadingLive(false);
    }
  };

  // Fetch Schedule
  const fetchSchedule = async () => {
    setLoadingSchedule(true);
    try {
      const res = await fetch('/api/schedule');
      const data = await res.json();
      setScheduleList(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Search Player
  const handleSearchPlayer = async (name: string) => {
    if (!name.trim()) return;
    setLoadingPlayer(true);
    try {
      const res = await fetch(`/api/players/${encodeURIComponent(name)}`);
      const data: PlayerProfile = await res.json();
      setPlayerData(data);
    } catch {
      // ignore
    } finally {
      setLoadingPlayer(false);
    }
  };

  // Compare Players
  const handleCompare = async () => {
    setLoadingCompare(true);
    try {
      const [res1, res2]: [PlayerProfile, PlayerProfile] = await Promise.all([
        fetch(`/api/players/${encodeURIComponent(compareP1)}`).then((r) => r.json()),
        fetch(`/api/players/${encodeURIComponent(compareP2)}`).then((r) => r.json()),
      ]);
      setComparisonData({ player1: res1, player2: res2 });
    } catch {
      // ignore
    } finally {
      setLoadingCompare(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function initializeHub() {
      try {
        const [liveRes, schedRes, p1Res, p2Res] = await Promise.all([
          fetch('/api/live').then((r) => r.json()),
          fetch('/api/schedule').then((r) => r.json()),
          fetch('/api/players/Virat%20Kohli').then((r) => r.json()),
          fetch('/api/players/Babar%20Azam').then((r) => r.json()),
        ]);

        if (!isCancelled) {
          setLiveScores(Array.isArray(liveRes) ? liveRes : []);
          setScheduleList(Array.isArray(schedRes) ? schedRes : []);
          setPlayerData(p1Res);
          setComparisonData({ player1: p1Res, player2: p2Res });
        }
      } catch {
        // ignore
      }
    }

    initializeHub();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/"
            className="tv-focusable inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Broadcast Matrix</span>
          </Link>
          <h1 className="font-display text-3xl font-extrabold text-white flex items-center space-x-3">
            <span>Cricket Hub & Telemetry API</span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-mono text-emerald-400">
              v2.0 LIVE
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time live scores, upcoming international schedule, player stats, and head-to-head comparison engine.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-white/5 p-1.5 border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab('live')}
            className={cn(
              'flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-bold transition-all',
              activeTab === 'live'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Live Scores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-bold transition-all',
              activeTab === 'schedule'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Schedule</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('player')}
            className={cn(
              'flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-bold transition-all',
              activeTab === 'player'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <User className="h-3.5 w-3.5" />
            <span>Player Stats</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={cn(
              'flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-bold transition-all',
              activeTab === 'compare'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Compare</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Live Scores */}
      {activeTab === 'live' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-rose-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
              </span>
              <h2 className="font-display text-lg font-bold text-white">
                Live Cricket Matches (Cricbuzz Uplink)
              </h2>
            </div>

            <button
              type="button"
              onClick={fetchLiveScores}
              disabled={loadingLive}
              className="tv-focusable inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loadingLive && 'animate-spin')} />
              <span>Refresh Feed</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveScores.map((scoreText, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-white/8 bg-[#0B111E] p-5 glass-card space-y-3 hover:border-emerald-500/40 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-0.5 rounded">
                    MATCH {idx + 1}
                  </span>
                  <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-bold text-rose-400 flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    <span>ON AIR</span>
                  </span>
                </div>

                <p className="font-display text-sm font-semibold text-slate-100 leading-relaxed">
                  {scoreText}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                  <span>Source: Cricbuzz Global</span>
                  <Link
                    href="/#channels"
                    className="text-emerald-400 hover:underline flex items-center space-x-1"
                  >
                    <span>Watch Stream</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Upcoming Schedule */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-white flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-emerald-400" />
              <span>Upcoming International Cricket Schedule</span>
            </h2>

            <button
              type="button"
              onClick={fetchSchedule}
              disabled={loadingSchedule}
              className="tv-focusable inline-flex items-center space-x-1.5 text-xs text-slate-300 hover:text-emerald-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loadingSchedule && 'animate-spin')} />
              <span>Sync Schedule</span>
            </button>
          </div>

          <div className="divide-y divide-white/5 rounded-2xl border border-white/8 bg-[#0B111E] glass-card overflow-hidden">
            {scheduleList.map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 font-mono text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-100 block">
                      {item}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Broadcast via Livecric Edge CDN
                    </span>
                  </div>
                </div>

                <Link
                  href="/#channels"
                  className="hidden sm:inline-flex items-center space-x-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-black transition-all"
                >
                  <span>Set Alert</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Player Stats Search */}
      {activeTab === 'player' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <input
                type="text"
                value={playerSearchQuery}
                onChange={(e) => setPlayerSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPlayer(playerSearchQuery)}
                placeholder="Search any cricket player (e.g., Virat Kohli, Babar Azam, Pat Cummins, Rashid Khan)..."
                className="w-full rounded-xl border border-white/10 bg-[#0B111E] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-emerald-500/50 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => handleSearchPlayer(playerSearchQuery)}
              disabled={loadingPlayer}
              className="tv-focusable w-full sm:w-auto rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shrink-0"
            >
              {loadingPlayer ? 'Searching...' : 'Search Player'}
            </button>
          </div>

          {/* Quick Player Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">Popular:</span>
            {['Virat Kohli', 'Babar Azam', 'Pat Cummins', 'Rashid Khan', 'Ellyse Perry'].map(
              (name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    setPlayerSearchQuery(name);
                    handleSearchPlayer(name);
                  }}
                  className="rounded-lg bg-white/5 border border-white/10 px-2.5 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-emerald-400 transition-colors"
                >
                  {name}
                </button>
              )
            )}
          </div>

          {/* Player Profile Result Card */}
          {playerData && (
            <div className="rounded-2xl border border-white/10 bg-[#0B111E] p-6 glass-card space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden border border-emerald-500/30 bg-black shrink-0">
                    <img
                      src={playerData.image}
                      alt={playerData.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {playerData.country} • {playerData.role}
                    </span>
                    <h3 className="font-display text-2xl font-black text-white">
                      {playerData.name}
                    </h3>
                  </div>
                </div>

                {/* ICC Rankings Badge */}
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Test Rank
                    </span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      #{playerData.rankings?.batting?.test || '--'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      ODI Rank
                    </span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      #{playerData.rankings?.batting?.odi || '--'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-black/40 border border-white/5 p-3 text-center">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      T20I Rank
                    </span>
                    <span className="font-mono text-base font-bold text-emerald-400">
                      #{playerData.rankings?.batting?.t20 || '--'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Batting Career Summary Table */}
              <div className="space-y-3">
                <h4 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                  <Trophy className="h-4 w-4 text-emerald-400" />
                  <span>Batting Career Summary</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/40 text-slate-400 uppercase">
                      <tr>
                        <th className="p-2.5">Format</th>
                        <th className="p-2.5">Matches</th>
                        <th className="p-2.5">Runs</th>
                        <th className="p-2.5">HS</th>
                        <th className="p-2.5">Avg</th>
                        <th className="p-2.5">SR</th>
                        <th className="p-2.5">100s</th>
                        <th className="p-2.5">50s</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {Object.entries(playerData.batting_stats || {}).map(([fmt, s]: [string, BattingSummary]) => (
                        <tr key={fmt} className="hover:bg-white/[0.02]">
                          <td className="p-2.5 font-bold uppercase text-emerald-400">{fmt}</td>
                          <td className="p-2.5">{s.matches}</td>
                          <td className="p-2.5 font-bold text-white">{s.runs}</td>
                          <td className="p-2.5">{s.highest_score}</td>
                          <td className="p-2.5">{s.average}</td>
                          <td className="p-2.5">{s.strike_rate}</td>
                          <td className="p-2.5 text-amber-400 font-bold">{s.hundreds}</td>
                          <td className="p-2.5">{s.fifties}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bowling Career Summary Table */}
              <div className="space-y-3 pt-4 border-t border-white/5">
                <h4 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-cyan-400" />
                  <span>Bowling Career Summary</span>
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-black/40 text-slate-400 uppercase">
                      <tr>
                        <th className="p-2.5">Format</th>
                        <th className="p-2.5">Balls</th>
                        <th className="p-2.5">Runs</th>
                        <th className="p-2.5">Wickets</th>
                        <th className="p-2.5">BBI</th>
                        <th className="p-2.5">Econ</th>
                        <th className="p-2.5">5W</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-slate-200">
                      {Object.entries(playerData.bowling_stats || {}).map(([fmt, s]: [string, BowlingSummary]) => (
                        <tr key={fmt} className="hover:bg-white/[0.02]">
                          <td className="p-2.5 font-bold uppercase text-cyan-400">{fmt}</td>
                          <td className="p-2.5">{s.balls}</td>
                          <td className="p-2.5">{s.runs}</td>
                          <td className="p-2.5 font-bold text-white">{s.wickets}</td>
                          <td className="p-2.5">{s.best_bowling_innings}</td>
                          <td className="p-2.5">{s.economy}</td>
                          <td className="p-2.5 text-amber-400 font-bold">{s.five_wickets}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Player Comparison Tool */}
      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={compareP1}
              onChange={(e) => setCompareP1(e.target.value)}
              placeholder="Player 1 (e.g., Virat Kohli)"
              className="w-full rounded-xl border border-white/10 bg-[#0B111E] py-2.5 px-4 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
            />
            <span className="font-mono text-xs font-bold text-slate-500">VS</span>
            <input
              type="text"
              value={compareP2}
              onChange={(e) => setCompareP2(e.target.value)}
              placeholder="Player 2 (e.g., Babar Azam)"
              className="w-full rounded-xl border border-white/10 bg-[#0B111E] py-2.5 px-4 text-sm text-white focus:border-emerald-500/50 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCompare}
              disabled={loadingCompare}
              className="tv-focusable w-full sm:w-auto rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-black hover:bg-emerald-400 transition-all shrink-0"
            >
              {loadingCompare ? 'Comparing...' : 'Compare Players'}
            </button>
          </div>

          {comparisonData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 Card */}
              <div className="rounded-2xl border border-emerald-500/30 bg-[#0B111E] p-6 glass-card space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-black shrink-0">
                    <img
                      src={comparisonData.player1.image}
                      alt={comparisonData.player1.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-emerald-400 font-bold">
                      {comparisonData.player1.country}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      {comparisonData.player1.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">TEST AVG</span>
                    <span className="text-white font-bold">
                      {comparisonData.player1.batting_stats?.test?.average || '--'}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">ODI AVG</span>
                    <span className="text-emerald-400 font-bold">
                      {comparisonData.player1.batting_stats?.odi?.average || '--'}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">TOTAL 100s</span>
                    <span className="text-amber-400 font-bold">
                      {Number(comparisonData.player1.batting_stats?.test?.hundreds || 0) +
                        Number(comparisonData.player1.batting_stats?.odi?.hundreds || 0) +
                        Number(comparisonData.player1.batting_stats?.t20i?.hundreds || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Player 2 Card */}
              <div className="rounded-2xl border border-cyan-500/30 bg-[#0B111E] p-6 glass-card space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-xl overflow-hidden bg-black shrink-0">
                    <img
                      src={comparisonData.player2.image}
                      alt={comparisonData.player2.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-cyan-400 font-bold">
                      {comparisonData.player2.country}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">
                      {comparisonData.player2.name}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">TEST AVG</span>
                    <span className="text-white font-bold">
                      {comparisonData.player2.batting_stats?.test?.average || '--'}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">ODI AVG</span>
                    <span className="text-cyan-400 font-bold">
                      {comparisonData.player2.batting_stats?.odi?.average || '--'}
                    </span>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg">
                    <span className="text-slate-500 text-[10px] block">TOTAL 100s</span>
                    <span className="text-amber-400 font-bold">
                      {Number(comparisonData.player2.batting_stats?.test?.hundreds || 0) +
                        Number(comparisonData.player2.batting_stats?.odi?.hundreds || 0) +
                        Number(comparisonData.player2.batting_stats?.t20i?.hundreds || 0)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
