import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCricketOvers,
  ballsToOvers,
  addOvers,
  calculateRunRate,
  calculateEconomy,
  calculateRequiredRunRate,
} from '../src/lib/cricketOvers';

describe('Cricket Overs Precision Arithmetic', () => {
  it('correctly parses overs string into whole overs and legal deliveries', () => {
    const parsed = parseCricketOvers('41.2');
    assert.equal(parsed.overs, 41);
    assert.equal(parsed.balls, 2);
    assert.equal(parsed.totalBalls, 41 * 6 + 2); // 248 balls
    assert.equal(parsed.formatted, '41.2');
  });

  it('correctly parses overs number without IEEE 754 float drift', () => {
    const parsed = parseCricketOvers(41.2);
    assert.equal(parsed.overs, 41);
    assert.equal(parsed.balls, 2);
    assert.equal(parsed.totalBalls, 248);
    assert.equal(parsed.formatted, '41.2');
  });

  it('converts total balls back into canonical overs format', () => {
    const result = ballsToOvers(248);
    assert.equal(result.overs, 41);
    assert.equal(result.balls, 2);
    assert.equal(result.formatted, '41.2');

    const exactOver = ballsToOvers(120); // 20 overs
    assert.equal(exactOver.overs, 20);
    assert.equal(exactOver.balls, 0);
    assert.equal(exactOver.formatted, '20.0');
  });

  it('accurately adds overs across over boundaries without floating-point errors', () => {
    // 41.4 overs (250 balls) + 0.4 overs (4 balls) = 254 balls = 42.2 overs
    // Standard float addition (41.4 + 0.4 = 41.8) is completely invalid in cricket
    const sum = addOvers('41.4', '0.4');
    assert.equal(sum.formatted, '42.2');
    assert.equal(sum.overs, 42);
    assert.equal(sum.balls, 2);
    assert.equal(sum.totalBalls, 254);
  });

  it('calculates exact run rate from runs and overs', () => {
    // 242 runs in 41.2 overs (248 balls) -> 242 * 6 / 248 = 5.8548... -> 5.85
    const rr = calculateRunRate(242, '41.2');
    assert.equal(rr, 5.85);

    // 0 balls bowled returns 0
    assert.equal(calculateRunRate(0, '0.0'), 0);
  });

  it('calculates bowler economy rate accurately', () => {
    // 42 runs in 8.4 overs (52 balls) -> 42 * 6 / 52 = 4.846... -> 4.85
    const econ = calculateEconomy(42, '8.4');
    assert.equal(econ, 4.85);
  });

  it('calculates required run rate with boundary edge cases', () => {
    // 42 runs needed in 52 balls -> 42 * 6 / 52 = 4.85
    const rrr = calculateRequiredRunRate(42, 52);
    assert.equal(rrr, 4.85);

    // 0 runs needed returns 0
    assert.equal(calculateRequiredRunRate(0, 10), 0);

    // 5 runs needed in 0 balls returns Infinity
    assert.equal(calculateRequiredRunRate(5, 0), Infinity);
  });
});
