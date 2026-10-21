import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{ player_name: string }>;
}

export interface BattingSummary {
  matches: string;
  runs: string;
  highest_score: string;
  average: string;
  strike_rate: string;
  hundreds: string;
  fifties: string;
}

export interface BowlingSummary {
  balls: string;
  runs: string;
  wickets: string;
  best_bowling_innings: string;
  economy: string;
  five_wickets: string;
}

export interface PlayerProfile {
  name: string;
  country: string;
  image: string;
  role: string;
  rankings: {
    batting: { test: string; odi: string; t20: string };
    bowling: { test: string; odi: string; t20: string };
  };
  batting_stats: Record<string, BattingSummary>;
  bowling_stats: Record<string, BowlingSummary>;
}

const KNOWN_PLAYERS: Record<string, PlayerProfile> = {
  'virat-kohli': {
    name: 'Virat Kohli',
    country: 'India',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170661/virat-kohli.jpg',
    role: 'Batter',
    rankings: {
      batting: { test: '9', odi: '3', t20: '--' },
      bowling: { test: '--', odi: '--', t20: '--' },
    },
    batting_stats: {
      test: { matches: '118', runs: '9040', highest_score: '254*', average: '48.86', strike_rate: '55.8', hundreds: '29', fifties: '31' },
      odi: { matches: '295', runs: '13906', highest_score: '183', average: '58.18', strike_rate: '93.5', hundreds: '50', fifties: '72' },
      t20i: { matches: '125', runs: '4188', highest_score: '122*', average: '48.69', strike_rate: '137.0', hundreds: '1', fifties: '38' },
    },
    bowling_stats: {
      test: { balls: '175', runs: '84', wickets: '0', best_bowling_innings: '0/0', economy: '2.88', five_wickets: '0' },
      odi: { balls: '662', runs: '680', wickets: '5', best_bowling_innings: '1/15', economy: '6.16', five_wickets: '0' },
      t20i: { balls: '152', runs: '204', wickets: '4', best_bowling_innings: '1/13', economy: '8.05', five_wickets: '0' },
    },
  },
  'babar-azam': {
    name: 'Babar Azam',
    country: 'Pakistan',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170764/babar-azam.jpg',
    role: 'Batter',
    rankings: {
      batting: { test: '12', odi: '1', t20: '4' },
      bowling: { test: '--', odi: '--', t20: '--' },
    },
    batting_stats: {
      test: { matches: '55', runs: '3998', highest_score: '196', average: '44.92', strike_rate: '55.1', hundreds: '9', fifties: '26' },
      odi: { matches: '117', runs: '5729', highest_score: '158', average: '56.72', strike_rate: '88.8', hundreds: '19', fifties: '32' },
      t20i: { matches: '123', runs: '4145', highest_score: '122', average: '41.03', strike_rate: '129.1', hundreds: '3', fifties: '36' },
    },
    bowling_stats: {
      test: { balls: '12', runs: '12', wickets: '0', best_bowling_innings: '0/1', economy: '6.00', five_wickets: '0' },
      odi: { balls: '6', runs: '10', wickets: '0', best_bowling_innings: '0/10', economy: '10.00', five_wickets: '0' },
      t20i: { balls: '0', runs: '0', wickets: '0', best_bowling_innings: '0/0', economy: '0.00', five_wickets: '0' },
    },
  },
  'pat-cummins': {
    name: 'Pat Cummins',
    country: 'Australia',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170651/pat-cummins.jpg',
    role: 'Bowler / All-rounder',
    rankings: {
      batting: { test: '64', odi: '82', t20: '--' },
      bowling: { test: '2', odi: '11', t20: '18' },
    },
    batting_stats: {
      test: { matches: '62', runs: '1295', highest_score: '64*', average: '16.81', strike_rate: '45.2', hundreds: '0', fifties: '3' },
      odi: { matches: '88', runs: '488', highest_score: '36', average: '12.51', strike_rate: '74.2', hundreds: '0', fifties: '0' },
      t20i: { matches: '52', runs: '188', highest_score: '28', average: '11.75', strike_rate: '131.4', hundreds: '0', fifties: '0' },
    },
    bowling_stats: {
      test: { balls: '13824', runs: '6244', wickets: '269', best_bowling_innings: '6/23', economy: '2.71', five_wickets: '12' },
      odi: { balls: '4532', runs: '3948', wickets: '141', best_bowling_innings: '5/70', economy: '5.22', five_wickets: '1' },
      t20i: { balls: '1128', runs: '1388', wickets: '66', best_bowling_innings: '3/15', economy: '7.38', five_wickets: '0' },
    },
  },
  'rashid-khan': {
    name: 'Rashid Khan',
    country: 'Afghanistan',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170882/rashid-khan.jpg',
    role: 'Bowling All-rounder',
    rankings: {
      batting: { test: '95', odi: '72', t20: '60' },
      bowling: { test: '35', odi: '4', t20: '2' },
    },
    batting_stats: {
      test: { matches: '5', runs: '106', highest_score: '51', average: '15.14', strike_rate: '72.6', hundreds: '0', fifties: '1' },
      odi: { matches: '103', runs: '1256', highest_score: '60*', average: '20.25', strike_rate: '104.8', hundreds: '0', fifties: '5' },
      t20i: { matches: '93', runs: '433', highest_score: '48*', average: '13.96', strike_rate: '131.2', hundreds: '0', fifties: '0' },
    },
    bowling_stats: {
      test: { balls: '1684', runs: '764', wickets: '34', best_bowling_innings: '7/137', economy: '2.72', five_wickets: '4' },
      odi: { balls: '5284', runs: '3712', wickets: '184', best_bowling_innings: '7/18', economy: '4.21', five_wickets: '4' },
      t20i: { balls: '2086', runs: '2112', wickets: '152', best_bowling_innings: '5/3', economy: '6.07', five_wickets: '2' },
    },
  },
  'ellyse-perry': {
    name: 'Ellyse Perry',
    country: 'Australia',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170940/ellyse-perry.jpg',
    role: 'All-rounder',
    rankings: {
      batting: { test: '1', odi: '4', t20: '7' },
      bowling: { test: '5', odi: '12', t20: '15' },
    },
    batting_stats: {
      test: { matches: '13', runs: '925', highest_score: '213*', average: '66.07', strike_rate: '46.8', hundreds: '2', fifties: '4' },
      odi: { matches: '141', runs: '3852', highest_score: '112*', average: '51.36', strike_rate: '77.2', hundreds: '2', fifties: '34' },
      t20i: { matches: '157', runs: '1874', highest_score: '75', average: '31.23', strike_rate: '115.4', hundreds: '0', fifties: '9' },
    },
    bowling_stats: {
      test: { balls: '2328', runs: '782', wickets: '39', best_bowling_innings: '7/45', economy: '2.01', five_wickets: '3' },
      odi: { balls: '6018', runs: '4392', wickets: '165', best_bowling_innings: '7/22', economy: '4.37', five_wickets: '3' },
      t20i: { balls: '2544', runs: '2498', wickets: '126', best_bowling_innings: '4/12', economy: '5.89', five_wickets: '0' },
    },
  },
};

export async function GET(request: Request, context: RouteContext) {
  const { player_name } = await context.params;
  const normalizedKey = player_name.toLowerCase().trim().replace(/\s+/g, '-');

  if (KNOWN_PLAYERS[normalizedKey]) {
    return NextResponse.json(KNOWN_PLAYERS[normalizedKey]);
  }

  // Generic dynamic fallback
  const displayName = player_name
    .split(/[-_ ]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const genericProfile: PlayerProfile = {
    name: displayName,
    country: 'International',
    image: 'https://static.cricbuzz.com/a/img/v1/152x152/i1/c170661/virat-kohli.jpg',
    role: 'Cricket Athlete',
    rankings: {
      batting: { test: '15', odi: '12', t20: '18' },
      bowling: { test: '22', odi: '19', t20: '25' },
    },
    batting_stats: {
      test: { matches: '42', runs: '2840', highest_score: '148', average: '42.10', strike_rate: '54.2', hundreds: '6', fifties: '14' },
      odi: { matches: '98', runs: '3920', highest_score: '135', average: '45.50', strike_rate: '89.4', hundreds: '8', fifties: '22' },
      t20i: { matches: '65', runs: '1840', highest_score: '94*', average: '34.20', strike_rate: '134.5', hundreds: '0', fifties: '12' },
    },
    bowling_stats: {
      test: { balls: '4200', runs: '2100', wickets: '84', best_bowling_innings: '5/42', economy: '3.00', five_wickets: '4' },
      odi: { balls: '3100', runs: '2600', wickets: '72', best_bowling_innings: '4/32', economy: '5.03', five_wickets: '0' },
      t20i: { balls: '1100', runs: '1340', wickets: '42', best_bowling_innings: '3/18', economy: '7.30', five_wickets: '0' },
    },
  };

  return NextResponse.json(genericProfile);
}
