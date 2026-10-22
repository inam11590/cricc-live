import React from 'react';
import { cn } from '@/lib/utils';
import { Info, CheckCircle2, Clock } from 'lucide-react';
import { CricketDataSource } from '@/types/cricket';

interface DemoDataBadgeProps {
  className?: string;
  variant?: 'subtle' | 'banner';
  isDemo?: boolean;
  source?: CricketDataSource;
  isStale?: boolean;
  lastUpdated?: string;
}

export function DemoDataBadge({
  className,
  variant = 'subtle',
  isDemo = true,
  source = 'mock',
  isStale = false,
  lastUpdated,
}: DemoDataBadgeProps) {
  // If data is from a real, verified live feed
  if (!isDemo) {
    if (variant === 'banner') {
      return (
        <div
          className={cn(
            'flex items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-4 py-2 text-xs text-emerald-200/90 shadow-sm',
            className
          )}
          role="status"
          aria-label="Verified Cricket Data Feed Notice"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-emerald-300">Live Provider Feed:</strong>{' '}
              Telemetry connected to verified {source === 'partner_api' ? 'Partner API' : 'Microservice Bridge'}.
            </span>
          </div>
          {isStale && (
            <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase">
              <Clock className="h-3 w-3" /> Stale (Cached)
            </span>
          )}
        </div>
      );
    }

    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-300',
          className
        )}
        title={lastUpdated ? `Verified feed updated at ${lastUpdated}` : 'Verified cricket data feed'}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{source === 'partner_api' ? 'PARTNER API' : 'LIVE FEED'}</span>
        {isStale && <span className="text-amber-400 font-bold ml-1">(STALE)</span>}
      </span>
    );
  }

  // Demo / Mock Mode
  if (variant === 'banner') {
    return (
      <div
        className={cn(
          'flex items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-200/90 shadow-sm',
          className
        )}
        role="status"
        aria-label="Development Demo Data Notice"
      >
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-amber-300">Development Demo Mode:</strong> Scores, fixtures, and telemetry shown on this screen are realistic sample data fixtures prepared for architectural verification.
          </span>
        </div>
        <span className="shrink-0 rounded bg-amber-400/20 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-300 uppercase">
          Phase 2 Mock
        </span>
      </div>
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-300',
        className
      )}
      title="Sample fixture for development and architectural verification"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      <span>DEMO DATA</span>
    </span>
  );
}
