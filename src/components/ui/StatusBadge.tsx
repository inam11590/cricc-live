import React from 'react';
import { cn } from '@/lib/utils';
import { MatchStatus } from '@/types/cricket';

interface StatusBadgeProps {
  status: MatchStatus;
  customText?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({
  status,
  customText,
  size = 'md',
  className,
}: StatusBadgeProps) {
  const isLive = status === 'LIVE' || status === 'INNINGS_BREAK';
  const isStumps = status === 'STUMPS' || status === 'TEA' || status === 'LUNCH';
  const isUpcoming = status === 'UPCOMING';
  const isCompleted = status === 'COMPLETED';

  let label = customText || status;
  if (status === 'INNINGS_BREAK') label = customText || 'INNINGS BREAK';
  if (status === 'STUMPS') label = customText || 'STUMPS';

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  if (isLive) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-mono font-bold tracking-wider uppercase',
          'bg-rose-500/15 border border-rose-500/30 text-rose-400',
          sizeClasses,
          className
        )}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
        </span>
        <span>{label}</span>
      </span>
    );
  }

  if (isStumps) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider uppercase',
          'bg-amber-500/15 border border-amber-500/30 text-amber-300',
          sizeClasses,
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
        <span>{label}</span>
      </span>
    );
  }

  if (isUpcoming) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider uppercase',
          'bg-blue-500/15 border border-blue-500/30 text-blue-300',
          sizeClasses,
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
        <span>{label}</span>
      </span>
    );
  }

  if (isCompleted) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider uppercase',
          'bg-slate-800/80 border border-slate-700 text-slate-300',
          sizeClasses,
          className
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        <span>{label}</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-mono font-semibold tracking-wider uppercase',
        'bg-slate-800 border border-slate-700 text-slate-400',
        sizeClasses,
        className
      )}
    >
      <span>{label}</span>
    </span>
  );
}
