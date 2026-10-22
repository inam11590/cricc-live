import React from 'react';
import Link from 'next/link';
import { Layers, Shield, Zap, Clock, ArrowRight } from 'lucide-react';

export function CricketFormatsSection() {
  const formats = [
    {
      id: 'test',
      name: 'Test Cricket',
      badge: 'The Ultimate Pinnacle',
      overs: 'Up to 450 Overs (5 Days)',
      ball: 'Red / Pink Ball (Day-Night)',
      icon: Shield,
      color: 'from-rose-500/20 to-[#0F172A]',
      borderColor: 'border-rose-500/30',
      textColor: 'text-rose-400',
      description:
        'The purest crucible of cricket: 4 innings, 5 full days of mental endurance, swinging seam conditions, day 5 deteriorating turn, and the World Test Championship mace.',
      rankingNo1: 'Australia (Rating: 124)',
      link: '/schedule?format=TEST',
    },
    {
      id: 'odi',
      name: 'One Day International (ODI)',
      badge: 'Strategic White-Ball Balance',
      overs: '50 Overs Per Side (300 Balls)',
      ball: 'White Kookaburra (Two New Balls)',
      icon: Clock,
      color: 'from-blue-500/20 to-[#0F172A]',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      description:
        'The classic format of the ICC Men’s Cricket World Cup and Champions Trophy. Demands constructed innings, tactical middle-over spin squeeze, and powerplay execution.',
      rankingNo1: 'India (Rating: 119)',
      link: '/schedule?format=ODI',
    },
    {
      id: 't20',
      name: 'Twenty20 (T20 & Franchise)',
      badge: 'High-Octane Modern Engine',
      overs: '20 Overs Per Side (120 Balls)',
      ball: 'White Ball Under Lights',
      icon: Zap,
      color: 'from-emerald-500/20 to-[#0F172A]',
      borderColor: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      description:
        'Explosive boundary percentages, 360-degree batting ramp shots, death-bowling yorkers, and unmatched global viewership across the IPL, T20 World Cup, and BBL.',
      rankingNo1: 'India (Rating: 268)',
      link: '/schedule?format=T20',
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
              Cricket Across All Three Formats
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Understanding the dynamics, strategies, and rules that govern international cricket.
          </p>
        </div>

        <Link
          href="/rankings"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <span>View ICC Format Rankings</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {formats.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.id}
              className={`relative overflow-hidden rounded-2xl border ${f.borderColor} bg-gradient-to-b ${f.color} p-6 shadow-xl flex flex-col justify-between space-y-6`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${f.textColor}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${f.textColor}`}>
                    {f.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">{f.name}</h3>
                  <div className="mt-2 space-y-1 text-xs font-mono text-slate-400">
                    <p>• {f.overs}</p>
                    <p>• {f.ball}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{f.description}</p>
              </div>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Current ICC #1:</span>
                  <span className="text-white font-bold">{f.rankingNo1}</span>
                </div>

                <Link
                  href={f.link}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-200 hover:bg-white/10 hover:text-white transition-all"
                >
                  <span>Filter {f.name} Fixtures</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
