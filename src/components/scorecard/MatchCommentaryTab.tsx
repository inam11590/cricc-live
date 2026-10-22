'use client';

import React from 'react';
import { CommentaryBall } from '@/types/cricket';
import { Radio } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchCommentaryTabProps {
  commentary?: CommentaryBall[];
}

export function MatchCommentaryTab({ commentary }: MatchCommentaryTabProps) {
  if (!commentary || commentary.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-12 text-center space-y-2">
        <Radio className="h-6 w-6 text-slate-500 mx-auto" />
        <p className="text-sm font-semibold text-slate-200">
          Ball-by-ball commentary not available for this fixture
        </p>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Detailed ball telemetry is streamed for featured live matches when supported by the active cricket data feed.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#0B111E] shadow-xl overflow-hidden">
        {commentary.map((ball) => (
          <div
            key={ball.id}
            className="p-4 sm:p-5 space-y-2 hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-300">
                  {ball.over}.{ball.ball}
                </span>
                <span className="font-mono text-xs font-semibold text-white">
                  {ball.bowlerName} to {ball.batterName}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {ball.isBoundary && (
                  <span
                    className={cn(
                      'rounded px-2 py-0.5 font-mono text-xs font-bold',
                      ball.boundaryType === 'SIX'
                        ? 'bg-rose-500 text-white'
                        : 'bg-emerald-500 text-black'
                    )}
                  >
                    {ball.boundaryType}
                  </span>
                )}
                {ball.isWicket && (
                  <span className="rounded bg-rose-600 px-2 py-0.5 font-mono text-xs font-bold text-white uppercase">
                    Wicket
                  </span>
                )}
                <span className="text-[11px] font-mono text-slate-500">
                  {ball.timestamp}
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              {ball.commentaryText}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
