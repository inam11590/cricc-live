import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCricketMatch,
  validateTeam,
  validateVenue,
} from '../src/lib/validation/cricketValidation';

describe('Cricket Domain Validation Engine', () => {
  it('validates a well-formed team object', () => {
    const validTeam = {
      name: 'India',
      code: 'IND',
      country: 'India',
      primaryColor: '#1E40AF',
    };

    const res = validateTeam(validTeam);
    assert.equal(res.valid, true);
    assert.equal(res.data?.code, 'IND');
  });

  it('rejects an invalid team with missing code and name', () => {
    const invalidTeam = {
      name: '',
      code: '',
    };

    const res = validateTeam(invalidTeam);
    assert.equal(res.valid, false);
    assert.equal(res.errors?.length, 2);
  });

  it('validates a complete cricket venue', () => {
    const venue = {
      name: 'Lord’s Cricket Ground',
      city: 'London',
      country: 'England',
      capacity: 31100,
    };

    const res = validateVenue(venue);
    assert.equal(res.valid, true);
    assert.equal(res.data?.name, 'Lord’s Cricket Ground');
    assert.equal(res.data?.city, 'London');
  });

  it('validates a complete cricket match payload', () => {
    const match = {
      id: 'match-ind-pak-t20',
      title: 'India vs Pakistan, 1st T20I',
      shortTitle: 'IND vs PAK',
      competition: 'T20 World Cup',
      format: 'T20I',
      status: 'LIVE',
      statusText: 'India need 12 runs in 6 balls',
      venue: {
        id: 'melbourne-cricket-ground',
        name: 'Melbourne Cricket Ground',
        city: 'Melbourne',
        country: 'Australia',
      },
      startTimeUtc: '2026-10-21T10:00:00Z',
      teams: {
        home: { name: 'India', code: 'IND' },
        away: { name: 'Pakistan', code: 'PAK' },
      },
      isDemo: true,
    };

    const res = validateCricketMatch(match);
    assert.equal(res.valid, true);
    assert.equal(res.data?.id, 'match-ind-pak-t20');
  });

  it('rejects match payload with invalid cricket format or status', () => {
    const malformed = {
      id: 'match-123',
      title: 'Malformed Clash',
      format: 'FOOTBALL_FORMAT', // Invalid format
      status: 'HALFTIME', // Invalid cricket status
      venue: { name: 'Stadium', city: 'City' },
      startTimeUtc: 'not-a-valid-date',
      teams: {
        home: { name: 'Team A', code: 'TMA' },
        away: { name: 'Team B', code: 'TMB' },
      },
      isDemo: true,
    };

    const res = validateCricketMatch(malformed);
    assert.equal(res.valid, false);
    assert.equal(res.errors?.some((e) => e.path === 'match.format'), true);
    assert.equal(res.errors?.some((e) => e.path === 'match.status'), true);
    assert.equal(res.errors?.some((e) => e.path === 'match.startTimeUtc'), true);
  });
});
