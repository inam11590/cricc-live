import { NextResponse } from 'next/server';
import { cricketService } from '@/services/cricketService';

export async function GET() {
  try {
    const result = await cricketService.getLiveMatchesResult();
    return NextResponse.json(result, {
      status: result.success ? 200 : 503,
      headers: {
        'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30',
        'X-Cricket-Source': result.metadata.source,
        'X-Cricket-Demo': String(result.metadata.isDemo),
        'X-Cricket-Cached': String(result.metadata.cached),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        metadata: {
          source: 'mock',
          isDemo: true,
          fetchedAt: new Date().toISOString(),
          cached: false,
          isStale: true,
        },
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'Unknown live matches retrieval error',
        },
      },
      { status: 500 }
    );
  }
}
