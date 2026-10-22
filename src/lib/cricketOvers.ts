/**
 * CricLive Cricket Overs & Balls Precision Arithmetic Module
 * 
 * In cricket, overs and balls follow base-6 ball increments (6 balls = 1 complete over).
 * Standard floating-point arithmetic (e.g. 41.2 + 0.1 = 41.300000000000004 or 41.5 + 0.1 = 41.6)
 * creates insidious bugs in sports data engines.
 * 
 * This module guarantees exact integer ball counts and prevents float drift.
 */

export interface CricketOversDetail {
  /** Completed whole overs (e.g., 41 in 41.2) */
  overs: number;
  /** Legal deliveries in current incomplete over (0 to 5) */
  balls: number;
  /** Total legal deliveries bowled (overs * 6 + balls) */
  totalBalls: number;
  /** Standard cricket string format (e.g., "41.2" or "42.0") */
  formatted: string;
  /** Decimal float representation for legacy consumer compatibility */
  asFloat: number;
}

/**
 * Parses an overs representation (string e.g. "41.2" or number e.g. 41.2)
 * into a precision CricketOversDetail structure.
 */
export function parseCricketOvers(input: number | string | null | undefined): CricketOversDetail {
  if (input === null || input === undefined || input === '') {
    return {
      overs: 0,
      balls: 0,
      totalBalls: 0,
      formatted: '0.0',
      asFloat: 0,
    };
  }

  let wholeOvers = 0;
  let remainingBalls = 0;

  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (!trimmed || isNaN(Number(trimmed))) {
      return { overs: 0, balls: 0, totalBalls: 0, formatted: '0.0', asFloat: 0 };
    }
    const parts = trimmed.split('.');
    const part0 = parts[0];
    const part1 = parts[1];
    wholeOvers = part0 ? parseInt(part0, 10) || 0 : 0;
    if (part1) {
      remainingBalls = parseInt(part1, 10) || 0;
    }
  } else {
    // Round to 1 decimal place string first to prevent IEEE 754 float mantissa errors
    const str = input.toFixed(1);
    const parts = str.split('.');
    const str0 = parts[0];
    const str1 = parts[1];
    wholeOvers = str0 ? parseInt(str0, 10) || 0 : 0;
    remainingBalls = str1 ? parseInt(str1, 10) || 0 : 0;
  }

  // Handle case where remaining balls exceeds 5 (e.g. input was improperly written as "41.6")
  const totalBalls = Math.max(0, wholeOvers * 6 + remainingBalls);
  const normalizedOvers = Math.floor(totalBalls / 6);
  const normalizedBalls = totalBalls % 6;

  return {
    overs: normalizedOvers,
    balls: normalizedBalls,
    totalBalls,
    formatted: `${normalizedOvers}.${normalizedBalls}`,
    asFloat: Number(`${normalizedOvers}.${normalizedBalls}`),
  };
}

/**
 * Converts an exact count of legal deliveries into a precision CricketOversDetail.
 */
export function ballsToOvers(totalBalls: number): CricketOversDetail {
  const safeBalls = Math.max(0, Math.floor(totalBalls || 0));
  const overs = Math.floor(safeBalls / 6);
  const balls = safeBalls % 6;

  return {
    overs,
    balls,
    totalBalls: safeBalls,
    formatted: `${overs}.${balls}`,
    asFloat: Number(`${overs}.${balls}`),
  };
}

/**
 * Accurately adds two overs values without floating-point errors.
 * Example: addOvers("41.4", "0.4") -> 250 balls + 4 balls = 254 balls -> "42.2" (not 41.8)
 */
export function addOvers(
  a: number | string | CricketOversDetail,
  b: number | string | CricketOversDetail
): CricketOversDetail {
  const detailA = typeof a === 'object' && a !== null && 'totalBalls' in a ? a : parseCricketOvers(a);
  const detailB = typeof b === 'object' && b !== null && 'totalBalls' in b ? b : parseCricketOvers(b);

  return ballsToOvers(detailA.totalBalls + detailB.totalBalls);
}

/**
 * Calculates Run Rate (runs per over = runs * 6 / totalBalls).
 * Returns 0 if no legal deliveries have been bowled.
 */
export function calculateRunRate(
  runs: number,
  overs: number | string | CricketOversDetail
): number {
  const detail = typeof overs === 'object' && overs !== null && 'totalBalls' in overs ? overs : parseCricketOvers(overs);
  if (detail.totalBalls <= 0) return 0;
  const rate = (runs * 6) / detail.totalBalls;
  return Math.round(rate * 100) / 100;
}

/**
 * Calculates Bowling Economy (runs conceded per over = runs * 6 / totalBalls).
 */
export function calculateEconomy(
  runsConceded: number,
  overs: number | string | CricketOversDetail
): number {
  return calculateRunRate(runsConceded, overs);
}

/**
 * Calculates Required Run Rate (runs needed * 6 / balls remaining).
 * Handles edge cases (0 balls remaining, negative runs, etc.).
 */
export function calculateRequiredRunRate(
  runsNeeded: number,
  ballsRemaining: number
): number {
  if (runsNeeded <= 0) return 0;
  if (ballsRemaining <= 0) return Infinity;

  const rate = (runsNeeded * 6) / ballsRemaining;
  return Math.round(rate * 100) / 100;
}

/**
 * Formats overs into strict cricket notation (e.g. "19.5 ov", where 5 represents legal balls, not a decimal fraction).
 */
export function formatOversNotation(
  overs: number | string | CricketOversDetail | undefined | null,
  suffix = ' ov'
): string {
  if (overs === undefined || overs === null) return `0.0${suffix}`;
  const detail =
    typeof overs === 'object' && overs !== null && 'formatted' in overs
      ? overs
      : parseCricketOvers(overs);
  return `${detail.formatted}${suffix}`;
}

/**
 * Returns integer completed overs, legal balls in current over, and total legal balls bowled.
 */
export function getOversBreakdown(
  overs: number | string | CricketOversDetail | undefined | null
): { completedOvers: number; ballsInOver: number; totalBalls: number } {
  const detail =
    typeof overs === 'object' && overs !== null && 'formatted' in overs
      ? overs
      : parseCricketOvers(overs);
  return {
    completedOvers: detail.overs,
    ballsInOver: detail.balls,
    totalBalls: detail.totalBalls,
  };
}
