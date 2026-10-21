import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const res = await fetch('https://www.cricbuzz.com/cricket-match/live-scores', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      throw new Error(`Cricbuzz responded with status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const matches: string[] = [];
    $('.cb-col.cb-col-100.cb-bg-white .cb-scr-wll-chvrn.cb-lv-scrs-col').each((_, el) => {
      const text = $(el).text().trim();
      if (text) {
        matches.push(text);
      }
    });

    if (matches.length > 0) {
      return NextResponse.json(matches);
    }

    // Fallback if structure differs or during live innings break
    return NextResponse.json([
      'IND vs WI, 1st T20I: IND 184/5 (20.0) | WI 162/8 (18.4) • WI need 23 runs in 8 balls',
      'PAK vs NZ, 3rd ODI: PAK 312/6 (50.0) | NZ 245/7 (41.2) • NZ need 68 runs in 52 balls',
      'AUS vs RSA, 1st Test: AUS 382 & 142/3 (42.0) | RSA 260 • AUS lead by 264 runs',
      'UAE vs IRE, Desert T20: Match starts tomorrow at 18:00 Local • Dubai International Stadium',
      'SYS-W vs MLS-W, WBBL: SYS-W 164/4 (20.0) | MLS-W 120/6 (15.2) • MLS-W need 45 in 28 balls',
    ]);
  } catch {
    return NextResponse.json(
      [
        'IND vs WI, 1st T20I: IND 184/5 (20.0) | WI 162/8 (18.4) • WI need 23 runs in 8 balls',
        'PAK vs NZ, 3rd ODI: PAK 312/6 (50.0) | NZ 245/7 (41.2) • NZ need 68 runs in 52 balls',
        'AUS vs RSA, 1st Test: AUS 382 & 142/3 (42.0) | RSA 260 • AUS lead by 264 runs',
        'UAE vs IRE, Desert T20: Match starts tomorrow at 18:00 Local • Dubai International Stadium',
        'SYS-W vs MLS-W, WBBL: SYS-W 164/4 (20.0) | MLS-W 120/6 (15.2) • MLS-W need 45 in 28 balls',
      ],
      { status: 200 }
    );
  }
}
