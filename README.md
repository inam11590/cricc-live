# CricLive — Live Cricket Scores & Match Center Platform

> **Production Release**: Modern, high-density cricket live-score and match-center analytics platform built with Next.js (App Router), React, TypeScript strict mode, and Tailwind CSS.

---

## 1. Overview & Brand Identity

**CricLive** is an enterprise-grade live cricket scores, match telemetry, and tournament tracking platform. Designed with a dark charcoal and deep navy foundation (`#05080F` / `#0B111E`), emerald-green primary accents (`#10B981`), controlled live-status alerts (`#F43F5E`), and high information density tailored for cricket fans, analysts, and followers of world cricket.

### Core Philosophy
- **High-Density Telemetry**: Overs, run rates, required run rates, target equations, batting scores, and bowling figures presented with clear visual hierarchy without clutter.
- **Cricket Scoring Correctness**: Full base-6 cricket overs representation (e.g. 19.5 overs = 19 overs + 5 legal balls, never decimal floats) with strict IEEE 754 precision protection.
- **Strict Data Contracts**: All data interactions route through a typed provider interface (`CricketDataProvider`), strictly separating development fixtures from UI layers and preparing the system for live API feeds.
- **Transparent Development Fixtures**: Clear "DEMO DATA" indicators during development to ensure unverified scores are never presented as verified live data.
- **Production Hardened**: Upstream timeout controls, transient 5xx bounded retries with exponential backoff, rate limit handling (`Retry-After`), single-flight request deduplication, bounded in-memory caching with eviction, and input sanitization across all API boundaries.

---

## 2. Technology Stack

- **Framework**: [Next.js 16.4](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering)
- **Language**: TypeScript 5 (Strict mode with `noUncheckedIndexedAccess`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with OLED dark tokens and CSS glassmorphic surfaces
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Next.js Google Fonts (`Outfit` for display headings, `Inter` for body, `JetBrains Mono` for numeric telemetry)
- **Linting & Code Quality**: ESLint 9 with Next.js core web vitals and React hooks rules
- **Testing**: Node.js native test runner (`node:test` + `node:assert/strict`) with `jiti` module resolution

---

## 3. Route Architecture

| Route | Status | Description |
|---|---|---|
| `/` | **Production Ready** | Full homepage featuring Hero, Featured Marquee Match, Interactive Match Center, Tournaments Showcase, Formats Guide, Editorial Desk, and Footer |
| `/live` | **Production Ready** | Dedicated live match center displaying ongoing encounters, live telemetry, and format filters |
| `/schedule` | **Production Ready** | Complete match schedule and upcoming fixtures grouped by format and tournament |
| `/results` | **Production Ready** | Concluded matches archive with winning margins, final scores, and player of the match awards |
| `/series` | **Production Ready** | Marquee ICC tournaments (Champions Trophy, WTC Cycle), bilateral rivalries (Border-Gavaskar Trophy, The Ashes), and franchise leagues (IPL) |
| `/rankings` | **Production Ready** | Official ICC Team, Batter, and Bowler rankings across Test, ODI, and T20I formats with ranking shift indicators |
| `/matches/[id]` | **Production Ready** | Complete Match Center featuring Innings Selector, Batting Scorecard, Bowling Figures, Fall of Wickets, Partnerships, Match Summary, and Commentary |
| `/api/matches/[id]` | **Production Ready** | Validated match details endpoint with HTTP cache headers, live match detection, and sanitized error boundaries |
| `/api/players/[player_name]` | **Production Ready** | Player profile endpoint with career statistics and input validation |
| `/api/compare` | **Production Ready** | Head-to-head player comparison endpoint with verified metadata derivation |
| `/api/schedule` | **Production Ready** | Scheduled fixtures with format filtering and bounded pagination |
| `/api/results` | **Production Ready** | Match results with format filtering and bounded pagination |

---

## 4. Cricket Data Providers

CricLive supports three swappable data providers via the `CRICLIVE_DATA_PROVIDER` environment variable:

1. **`mock` (Default)**:
   - High-fidelity offline cricket fixtures and statistics for development and testing.
   - Requires no API keys or external services.
   - Explicitly tags all responses with `metadata.isDemo = true`.

2. **`partner_api` (Production Authorized Feed)**:
   - Production REST adapter for verified sports data feeds.
   - Authenticated via server-side `x-api-key` header (never exposed to client).
   - Upstream timeouts with `AbortController`, bounded retries on 5xx errors, and `Retry-After` rate-limit handling.
   - Strictly marks responses with `metadata.isDemo = false`.

3. **`scraper_bridge` (Microservice Bridge)**:
   - Connects to an external Python scraper bridge service for real-time live match telemetry.

---

## 5. Configuration & Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

| Variable | Default | Description |
|---|---|---|
| `CRICLIVE_DATA_PROVIDER` | `mock` | Active provider: `mock`, `partner_api`, or `scraper_bridge` |
| `CRICLIVE_PARTNER_API_KEY` | `""` | Server-side secret key for authorized partner API (**never prefix with `NEXT_PUBLIC_`**) |
| `CRICLIVE_PARTNER_BASE_URL` | `https://api.cricket-data-partner.com/v1` | Upstream REST API endpoint |
| `CRICLIVE_SCRAPER_SERVICE_URL` | `http://localhost:5000` | Microservice endpoint for scraper bridge |
| `CRICLIVE_HTTP_TIMEOUT_MS` | `5000` | Upstream HTTP request timeout in milliseconds |
| `CRICLIVE_CACHE_LIVE_TTL_SECONDS` | `15` | In-memory cache TTL for live match scores (seconds) |
| `CRICLIVE_CACHE_STATIC_TTL_SECONDS` | `3600` | In-memory cache TTL for schedules, results, and rankings (seconds) |

---

## 6. Getting Started & Available Scripts

### Prerequisites
- Node.js `20.x` or `22.x`
- npm `10.x` or higher

### Installation
```bash
# Clone the repository
git clone <repo-url>
cd live-cric

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Quality & Verification Commands
```bash
# Run unit and integration test suite (81 tests across 21 test suites)
npm test

# Run ESLint code quality audit
npm run lint

# Production Next.js build
npm run build

# Start production server
npm run start
```

---

## 7. Production Hardening & Security Guarantees

- **Zero Secret Leakage**: API credentials (`CRICLIVE_PARTNER_API_KEY`) are accessed strictly on the server boundary. No secrets appear in `NEXT_PUBLIC_` variables, client bundles, or API response error messages.
- **Input Sanitization**: User-controlled identifiers (match IDs, player names, query parameters) are strictly validated against malicious patterns (`../`, control characters, SQL injection strings).
- **Single-Flight Request Deduplication**: Identical concurrent requests for the same upstream match fixture are collapsed into a single flight, preventing thundering herds.
- **Bounded In-Memory Cache**: LRU-style and TTL-based eviction bounded at 500 entries per instance, preventing memory leaks in persistent container runtimes.
- **Controlled Stale-on-Error Fallback**: If an upstream provider experiences a temporary outage, cached data is served with explicit `isStale: true` indicators rather than fabricating scores.
- **Overs Notation Correctness**: Strict cricket overs parser treats balls as base-6 deliveries (`19.5` = 19 overs, 5 legal deliveries).
- **Client Refresh Safety**: Polling is automatically suspended on backgrounded tabs (`document.visibilityState === 'hidden'`) and completed matches, and client-side requests timeout cleanly after 8 seconds with `AbortController`.

---

## 8. Deployment Process (Vercel / Node Container)

### Vercel Deployment
1. Connect repository to Vercel.
2. In **Project Settings > Environment Variables**, configure:
   - `CRICLIVE_DATA_PROVIDER`: `mock` (or `partner_api` if credentials are available).
   - `CRICLIVE_PARTNER_API_KEY`: production API key (if using `partner_api`).
3. Deploy without custom overrides (Next.js App Router default presets apply).

### Self-Hosted Node.js / Docker
```bash
npm run build
npm run start
```
Default port: `3000`. Set `PORT` environment variable to override.
