import { NextResponse } from 'next/server';
import { cricketService } from '@/services/cricketService';
import { isValidMatchId } from '@/lib/validation/cricketValidation';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!isValidMatchId(id)) {
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
            message: 'Invalid match identifier format. Match ID must be alphanumeric and up to 128 characters.',
          },
        },
        { status: 400 }
      );
    }

    const result = await cricketService.getMatchDetailsResult(id);

    if (!result.success || !result.data) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          metadata: result.metadata,
          error: result.error || {
            code: 'NOT_FOUND',
            message: `Match fixture '${id}' not found`,
          },
        },
        { status: 404 }
      );
    }

    const isMatchLive =
      result.data.status === 'LIVE' ||
      result.data.status === 'INNINGS_BREAK' ||
      result.data.status === 'TEA' ||
      result.data.status === 'LUNCH' ||
      result.data.status === 'STUMPS' ||
      result.data.status === 'RAIN_DELAY';

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Cache-Control': isMatchLive
          ? 'public, s-maxage=15, stale-while-revalidate=30'
          : 'public, s-maxage=3600, stale-while-revalidate=7200',
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
          message: 'An internal error occurred retrieving match telemetry',
        },
      },
      { status: 500 }
    );
  }
}
