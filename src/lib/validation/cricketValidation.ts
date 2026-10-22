/**
 * CricLive Runtime Validation Engine
 * 
 * Validates untrusted or external data payloads against canonical cricket domain models.
 * Implemented with lightweight, zero-dependency runtime schema validators and type guards.
 */

import {
  CricketMatch,
  CricketTeam,
  CricketVenue,
  CricketMatchStatus,
  MatchFormat,
  CricketPlayerProfile,
} from '@/types/cricket';

export interface ValidationError {
  path: string;
  message: string;
  received?: unknown;
}

export interface ValidationResult<T> {
  valid: boolean;
  data?: T;
  errors?: ValidationError[];
}

const VALID_FORMATS: MatchFormat[] = [
  'TEST',
  'ODI',
  'T20',
  'T20I',
  'T20_LEAGUE',
  'WOMEN_T20',
  'FIRST_CLASS',
];

const VALID_STATUSES: CricketMatchStatus[] = [
  'SCHEDULED',
  'UPCOMING',
  'LIVE',
  'INNINGS_BREAK',
  'TEA',
  'LUNCH',
  'STUMPS',
  'RAIN_DELAY',
  'COMPLETED',
  'ABANDONED',
  'NO_RESULT',
];

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateTeam(value: unknown, path = 'team'): ValidationResult<CricketTeam> {
  const errors: ValidationError[] = [];

  if (!isObject(value)) {
    return { valid: false, errors: [{ path, message: 'Expected object for team', received: typeof value }] };
  }

  if (typeof value.name !== 'string' || value.name.trim().length === 0) {
    errors.push({ path: `${path}.name`, message: 'Team name must be a non-empty string', received: value.name });
  }

  if (typeof value.code !== 'string' || value.code.trim().length === 0) {
    errors.push({ path: `${path}.code`, message: 'Team code must be a non-empty string', received: value.code });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      id: typeof value.id === 'string' ? value.id : undefined,
      name: String(value.name).trim(),
      shortName: typeof value.shortName === 'string' ? value.shortName : undefined,
      code: String(value.code).trim().toUpperCase(),
      country: typeof value.country === 'string' ? value.country : undefined,
      primaryColor: typeof value.primaryColor === 'string' ? value.primaryColor : undefined,
      secondaryColor: typeof value.secondaryColor === 'string' ? value.secondaryColor : undefined,
      crestUrl: typeof value.crestUrl === 'string' ? value.crestUrl : undefined,
    },
  };
}

export function validateVenue(value: unknown, path = 'venue'): ValidationResult<CricketVenue> {
  const errors: ValidationError[] = [];

  if (!isObject(value)) {
    return { valid: false, errors: [{ path, message: 'Expected object for venue', received: typeof value }] };
  }

  if (typeof value.name !== 'string' || value.name.trim().length === 0) {
    errors.push({ path: `${path}.name`, message: 'Venue name is required', received: value.name });
  }

  if (typeof value.city !== 'string') {
    errors.push({ path: `${path}.city`, message: 'Venue city is required', received: value.city });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: {
      id: typeof value.id === 'string' ? value.id : `venue-${String(value.name).toLowerCase().replace(/\s+/g, '-')}`,
      name: String(value.name),
      city: String(value.city),
      country: typeof value.country === 'string' ? value.country : '',
      capacity: typeof value.capacity === 'number' ? value.capacity : undefined,
    },
  };
}

export function validateCricketMatch(value: unknown, path = 'match'): ValidationResult<CricketMatch> {
  const errors: ValidationError[] = [];

  if (!isObject(value)) {
    return { valid: false, errors: [{ path, message: 'Expected object for match', received: typeof value }] };
  }

  // ID & Title
  if (typeof value.id !== 'string' || value.id.trim().length === 0) {
    errors.push({ path: `${path}.id`, message: 'Match ID must be a non-empty string', received: value.id });
  }

  if (typeof value.title !== 'string' || value.title.trim().length === 0) {
    errors.push({ path: `${path}.title`, message: 'Match title is required', received: value.title });
  }

  // Format
  if (!VALID_FORMATS.includes(value.format as MatchFormat)) {
    errors.push({
      path: `${path}.format`,
      message: `Invalid format: ${value.format}. Must be one of: ${VALID_FORMATS.join(', ')}`,
      received: value.format,
    });
  }

  // Status
  if (!VALID_STATUSES.includes(value.status as CricketMatchStatus)) {
    errors.push({
      path: `${path}.status`,
      message: `Invalid status: ${value.status}. Must be one of: ${VALID_STATUSES.join(', ')}`,
      received: value.status,
    });
  }

  // Teams validation
  if (!isObject(value.teams)) {
    errors.push({ path: `${path}.teams`, message: 'Match teams must be an object with home and away teams' });
  } else {
    const homeRes = validateTeam(value.teams.home, `${path}.teams.home`);
    const awayRes = validateTeam(value.teams.away, `${path}.teams.away`);
    if (!homeRes.valid && homeRes.errors) errors.push(...homeRes.errors);
    if (!awayRes.valid && awayRes.errors) errors.push(...awayRes.errors);
  }

  // Venue validation
  const venueRes = validateVenue(value.venue, `${path}.venue`);
  if (!venueRes.valid && venueRes.errors) {
    errors.push(...venueRes.errors);
  }

  // Start time ISO check
  if (typeof value.startTimeUtc !== 'string' || isNaN(Date.parse(value.startTimeUtc))) {
    errors.push({
      path: `${path}.startTimeUtc`,
      message: 'startTimeUtc must be a valid ISO 8601 date string',
      received: value.startTimeUtc,
    });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: value as unknown as CricketMatch,
  };
}

export function validatePlayerProfile(value: unknown, path = 'player'): ValidationResult<CricketPlayerProfile> {
  const errors: ValidationError[] = [];

  if (!isObject(value)) {
    return { valid: false, errors: [{ path, message: 'Expected object for player profile', received: typeof value }] };
  }

  if (typeof value.id !== 'string' || value.id.trim().length === 0) {
    errors.push({ path: `${path}.id`, message: 'Player id is required' });
  }

  if (typeof value.name !== 'string' || value.name.trim().length === 0) {
    errors.push({ path: `${path}.name`, message: 'Player name is required' });
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  return {
    valid: true,
    data: value as unknown as CricketPlayerProfile,
  };
}

// ==========================================
// User Input & Query Parameter Sanitizers
// ==========================================

const SAFE_IDENTIFIER_REGEX = /^[a-zA-Z0-9_\-\. ]+$/;
const SAFE_MATCH_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

/**
 * Validates match ID or slug, preventing path traversal, injection, or excessive length.
 */
export function isValidMatchId(id: unknown): id is string {
  if (typeof id !== 'string') return false;
  const trimmed = id.trim();
  if (trimmed.length === 0 || trimmed.length > 128) return false;
  if (trimmed.includes('..') || trimmed.includes('/') || trimmed.includes('\\')) return false;
  return SAFE_MATCH_ID_REGEX.test(trimmed);
}

/**
 * Validates player name or ID query string, rejecting malicious payload patterns.
 */
export function isValidPlayerIdentifier(name: unknown): name is string {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 128) return false;
  if (trimmed.includes('..') || trimmed.includes('<') || trimmed.includes('>') || trimmed.includes('\0')) {
    return false;
  }
  return SAFE_IDENTIFIER_REGEX.test(trimmed);
}

/**
 * Safely parses and bounds numerical limit parameters.
 */
export function sanitizeLimit(
  limit: unknown,
  min = 1,
  max = 100,
  defaultVal = 20
): number {
  if (typeof limit === 'number') {
    if (isNaN(limit)) return defaultVal;
    return Math.min(max, Math.max(min, Math.floor(limit)));
  }
  if (typeof limit === 'string') {
    const parsed = parseInt(limit.trim(), 10);
    if (isNaN(parsed)) return defaultVal;
    return Math.min(max, Math.max(min, parsed));
  }
  return defaultVal;
}

/**
 * Validates format query parameter against allowed domain formats.
 */
export function sanitizeFormat(format: unknown): MatchFormat | 'ALL' | undefined {
  if (typeof format !== 'string') return undefined;
  const upper = format.trim().toUpperCase();
  if (upper === 'ALL') return 'ALL';
  if (VALID_FORMATS.includes(upper as MatchFormat)) {
    return upper as MatchFormat;
  }
  return undefined;
}
