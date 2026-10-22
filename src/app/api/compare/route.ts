import { NextResponse } from 'next/server';
import { cricketService } from '@/services/cricketService';
import { isValidPlayerIdentifier } from '@/lib/validation/cricketValidation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const p1 = searchParams.get('p1') || 'Virat Kohli';
  const p2 = searchParams.get('p2') || 'Babar Azam';

  if (!isValidPlayerIdentifier(p1) || !isValidPlayerIdentifier(p2)) {
    return NextResponse.json(
      {
        error: 'Invalid player identifier format. Must not contain control characters or dangerous markup.',
      },
      { status: 400 }
    );
  }

  try {
    const [p1Result, p2Result] = await Promise.all([
      cricketService.getPlayerStatisticsResult(p1),
      cricketService.getPlayerStatisticsResult(p2),
    ]);

    const isDemo = Boolean(p1Result.metadata?.isDemo || p2Result.metadata?.isDemo);
    const source = p1Result.metadata?.source || p2Result.metadata?.source || 'mock';

    return NextResponse.json({
      player1: p1Result.data,
      player2: p2Result.data,
      metadata: {
        source,
        isDemo,
        fetchedAt: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      {
        error: 'Failed to fetch player comparison data',
      },
      { status: 500 }
    );
  }
}
