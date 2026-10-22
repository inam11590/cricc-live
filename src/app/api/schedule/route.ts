import { NextResponse } from 'next/server';
import { cricketService } from '@/services/cricketService';
import { sanitizeFormat, sanitizeLimit } from '@/lib/validation/cricketValidation';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = sanitizeFormat(searchParams.get('format'));
    const limitParam = searchParams.get('limit');
    const limit = limitParam !== null ? sanitizeLimit(limitParam) : undefined;

    const result = await cricketService.getFixturesResult({ format, limit });

    return NextResponse.json(result, {
      status: result.success ? 200 : 503,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        'X-Cricket-Source': result.metadata.source,
        'X-Cricket-Demo': String(result.metadata.isDemo),
      },
    });
  } catch {
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
          message: 'An internal error occurred retrieving match schedule',
        },
      },
      { status: 500 }
    );
  }
}
