import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MockCricketProvider } from '../src/services/provider/mockProvider';

describe('MockCricketProvider', () => {
  it('returns live matches with demo metadata', async () => {
    const provider = new MockCricketProvider();
    const result = await provider.getLiveMatches();

    assert.equal(result.success, true);
    assert.equal(Array.isArray(result.data), true);
    assert.equal(result.data.length > 0, true);
    assert.equal(result.metadata.isDemo, true);
    assert.equal(result.metadata.source, 'mock');

    for (const match of result.data) {
      assert.equal(match.isDemo, true);
      assert.equal(match.dataSource, 'mock');
      assert.equal(
        match.status === 'LIVE' ||
          match.status === 'INNINGS_BREAK' ||
          match.status === 'STUMPS' ||
          match.status === 'TEA' ||
          match.status === 'LUNCH',
        true
      );
    }
  });

  it('supports simulated empty results', async () => {
    const emptyProvider = new MockCricketProvider({ simulateEmpty: true });
    const result = await emptyProvider.getLiveMatches();

    assert.equal(result.success, true);
    assert.deepEqual(result.data, []);
    assert.equal(result.metadata.isDemo, true);
  });

  it('supports simulated provider error/outage', async () => {
    const failingProvider = new MockCricketProvider({ simulateError: true });
    const result = await failingProvider.getLiveMatches();

    assert.equal(result.success, false);
    assert.equal(result.error?.code, 'PROVIDER_UNAVAILABLE');
    assert.match(result.error?.message || '', /Simulated upstream provider outage/);
  });

  it('retrieves match details for valid match ID', async () => {
    const provider = new MockCricketProvider();
    const result = await provider.getMatchDetails('match-ind-aus-ct26');

    assert.equal(result.success, true);
    assert.equal(result.data?.id, 'match-ind-aus-ct26');
    assert.equal(result.data?.teams.home.name, 'India');
    assert.equal(result.data?.teams.away.name, 'Australia');
    assert.equal(result.metadata.isDemo, true);
  });

  it('returns NOT_FOUND for unknown match ID', async () => {
    const provider = new MockCricketProvider();
    const result = await provider.getMatchDetails('non-existent-match-xyz');

    assert.equal(result.success, false);
    assert.equal(result.data, null);
    assert.equal(result.error?.code, 'NOT_FOUND');
  });

  it('retrieves player career statistics', async () => {
    const provider = new MockCricketProvider();
    const result = await provider.getPlayerStatistics('virat-kohli');

    assert.equal(result.success, true);
    assert.equal(result.data?.name, 'Virat Kohli');
    assert.equal(result.data?.country, 'India');
    assert.equal(result.data?.batting_stats['odi']?.runs, '13906');
    assert.equal(result.metadata.isDemo, true);
  });
});
