import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const p1 = searchParams.get('p1') || 'Virat Kohli';
  const p2 = searchParams.get('p2') || 'Babar Azam';

  const origin = new URL(request.url).origin;

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${origin}/api/players/${encodeURIComponent(p1)}`).then((r) => r.json()),
      fetch(`${origin}/api/players/${encodeURIComponent(p2)}`).then((r) => r.json()),
    ]);

    return NextResponse.json({
      player1: res1,
      player2: res2,
    });
  } catch {
    return NextResponse.json({
      error: 'Failed to fetch player comparison data',
    }, { status: 500 });
  }
}
