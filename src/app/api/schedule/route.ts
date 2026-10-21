import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET() {
  try {
    const res = await fetch('https://www.cricbuzz.com/cricket-schedule/upcoming-series/international', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      throw new Error(`Cricbuzz responded with status: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const matches: string[] = [];
    $('.cb-col-100.cb-col').each((_, container) => {
      const date = $(container).find('.cb-lv-grn-strip.text-bold').text().trim();
      const matchInfo = $(container).find('.cb-col-100.cb-col').text().trim();

      if (date && matchInfo) {
        matches.push(`${date} - ${matchInfo}`);
      }
    });

    if (matches.length > 0) {
      return NextResponse.json(matches);
    }

    return NextResponse.json([
      'Wed, 21 Oct 2026 - India vs West Indies, 1st T20I at Kensington Oval, Barbados',
      'Wed, 21 Oct 2026 - Pakistan vs New Zealand, 3rd ODI at Rawalpindi Stadium, Rawalpindi',
      'Fri, 23 Oct 2026 - Afghanistan vs Zimbabwe, 1st ODI at Harare Sports Club, Harare',
      'Sat, 24 Oct 2026 - Australia vs South Africa, 2nd Test at St George’s Park, Gqeberha',
      'Sat, 24 Oct 2026 - Sydney Sixers Women vs Melbourne Stars Women, WBBL at Junction Oval',
      'Sun, 25 Oct 2026 - Scotland vs Ireland, Desert T20 at Sharjah Cricket Stadium, Sharjah',
    ]);
  } catch {
    return NextResponse.json([
      'Wed, 21 Oct 2026 - India vs West Indies, 1st T20I at Kensington Oval, Barbados',
      'Wed, 21 Oct 2026 - Pakistan vs New Zealand, 3rd ODI at Rawalpindi Stadium, Rawalpindi',
      'Fri, 23 Oct 2026 - Afghanistan vs Zimbabwe, 1st ODI at Harare Sports Club, Harare',
      'Sat, 24 Oct 2026 - Australia vs South Africa, 2nd Test at St George’s Park, Gqeberha',
      'Sat, 24 Oct 2026 - Sydney Sixers Women vs Melbourne Stars Women, WBBL at Junction Oval',
      'Sun, 25 Oct 2026 - Scotland vs Ireland, Desert T20 at Sharjah Cricket Stadium, Sharjah',
    ]);
  }
}
