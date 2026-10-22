import React from 'react';
import { cn } from '@/lib/utils';
import { TeamInfo } from '@/types/cricket';

interface TeamBadgeProps {
  team: TeamInfo;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
  nameClassName?: string;
}

const sizeMap = {
  xs: {
    container: 'h-6 w-6 text-[10px]',
    text: 'text-xs',
  },
  sm: {
    container: 'h-8 w-8 text-xs',
    text: 'text-xs',
  },
  md: {
    container: 'h-10 w-10 text-sm',
    text: 'text-sm font-semibold',
  },
  lg: {
    container: 'h-14 w-14 text-base font-bold',
    text: 'text-base font-bold',
  },
  xl: {
    container: 'h-20 w-20 text-xl font-extrabold',
    text: 'text-xl font-bold',
  },
};

export function TeamBadge({
  team,
  size = 'md',
  showName = false,
  className,
  nameClassName,
}: TeamBadgeProps) {
  const { container, text } = sizeMap[size];

  const color = team.primaryColor || team.accentColor || '#10B981';

  // Derive subtle background gradient from team primary color
  const bgStyle = {
    background: `linear-gradient(135deg, ${color} 0%, #0B111E 100%)`,
    borderColor: `${color}55`,
  };

  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center rounded-xl border font-mono font-bold tracking-wider text-white shadow-md transition-transform select-none',
          container
        )}
        style={bgStyle}
        aria-label={`${team.name} emblem`}
        role="img"
      >
        {/* Subtle inner gloss highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-transparent pointer-events-none" />
        <span className="relative z-10 drop-shadow-sm">{team.code}</span>
      </div>

      {showName && (
        <span className={cn('text-slate-100 font-medium tracking-tight', text, nameClassName)}>
          {team.name}
        </span>
      )}
    </div>
  );
}
