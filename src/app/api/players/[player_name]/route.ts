import { NextResponse } from 'next/server';
import { cricketService } from '@/services/cricketService';
import { isValidPlayerIdentifier } from '@/lib/validation/cricketValidation';
import {
  CricketPlayerProfile,
  BattingCareerSummary,
  BowlingCareerSummary,
} from '@/types/cricket';

export type PlayerProfile = CricketPlayerProfile;
export type BattingSummary = BattingCareerSummary;
export type BowlingSummary = BowlingCareerSummary;

interface RouteContext {
  params: Promise<{ player_name: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { player_name } = await context.params;

    if (!isValidPlayerIdentifier(player_name)) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          metadata: {
            source: 'mock',
            isDemo: true,
            fetchedAt: new Date().toISOString(),
            cached: false,
            isStale: false,
          },
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Invalid player identifier format. Must not contain control characters or dangerous markup.',
          },
        },
        { status: 400 }
      );
    }

    const result = await cricketService.getPlayerStatisticsResult(player_name);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          metadata: result.metadata,
          error: result.error || {
            code: 'NOT_FOUND',
            message: `Player statistics not found for '${player_name}'`,
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
        'X-Cricket-Source': result.metadata.source,
        'X-Cricket-Demo': String(result.metadata.isDemo),
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        data: null,
        metadata: {
          source: 'mock',
          isDemo: true,
          fetchedAt: new Date().toISOString(),
          cached: false,
          isStale: true,
        },
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An internal error occurred retrieving player statistics',
        },
      },
      { status: 500 }
    );
  }
}
