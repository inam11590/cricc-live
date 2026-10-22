/**
 * CricLive Centralized Environment & Runtime Configuration
 * 
 * Validates and sanitizes environment variables at startup/configuration boundaries.
 * Enforces strict security invariants:
 * - Credentials remain strictly server-side.
 * - Upstream endpoints must use authorized protocols (https:// or http:// in dev).
 * - Timeouts and TTLs are parsed with safe bounds, avoiding NaN or negative values.
 */

export interface AppConfig {
  providerName: 'mock' | 'partner_api' | 'scraper_bridge';
  partnerApiKey: string;
  partnerBaseUrl: string;
  scraperServiceUrl: string;
  httpTimeoutMs: number;
  cacheLiveTtlSeconds: number;
  cacheStaticTtlSeconds: number;
}

function parseBoundedInt(
  raw: string | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (!raw) return fallback;
  const parsed = parseInt(raw.trim(), 10);
  if (isNaN(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function sanitizeUrl(raw: string | undefined, fallback: string): string {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return fallback;
  }
  const trimmed = raw.trim();
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return fallback;
    }
    return trimmed.replace(/\/+$/, '');
  } catch {
    return fallback;
  }
}

export function getAppConfig(): AppConfig {
  const envProvider = (
    process.env.CRICLIVE_DATA_PROVIDER ||
    process.env.CRICKET_DATA_PROVIDER ||
    'mock'
  ).toLowerCase().trim();

  const providerName =
    envProvider === 'partner_api' || envProvider === 'scraper_bridge'
      ? envProvider
      : 'mock';

  return {
    providerName,
    partnerApiKey: (process.env.CRICLIVE_PARTNER_API_KEY || '').trim(),
    partnerBaseUrl: sanitizeUrl(
      process.env.CRICLIVE_PARTNER_BASE_URL,
      'https://api.cricket-data-partner.com/v1'
    ),
    scraperServiceUrl: sanitizeUrl(
      process.env.CRICLIVE_SCRAPER_SERVICE_URL,
      'http://localhost:5000'
    ),
    httpTimeoutMs: parseBoundedInt(process.env.CRICLIVE_HTTP_TIMEOUT_MS, 5000, 500, 60000),
    cacheLiveTtlSeconds: parseBoundedInt(process.env.CRICLIVE_CACHE_LIVE_TTL_SECONDS, 15, 5, 300),
    cacheStaticTtlSeconds: parseBoundedInt(process.env.CRICLIVE_CACHE_STATIC_TTL_SECONDS, 3600, 60, 86400),
  };
}
