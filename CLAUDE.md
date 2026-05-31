# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for the Munich Triathlon Club (MTC) website containing:
- **next-js-frontend/** - Next.js 16 frontend with React 19, App Router, and Payload CMS v3
- **strapi-cms-backend/** - Legacy Strapi v5 backend (superseded by Payload CMS, kept for reference)
- **utils/** - Data import/conversion scripts (legacy, used during Strapi era)

## Commands

### Frontend (next-js-frontend/)
```bash
pnpm dev             # Development with Turbopack
pnpm build           # Run migrations + production build
pnpm lint            # ESLint
pnpm payload generate:types   # Regenerate payload-types.ts after collection changes
pnpm payload migrate:create <name>  # Generate a new DB migration
pnpm payload migrate              # Apply pending migrations
pnpm import:league   # One-shot import of league data (idempotent)
```

## Architecture

### CMS
Payload CMS v3 is embedded directly in the Next.js app (`next-js-frontend/`). The admin panel is at `/admin`. The database is PostgreSQL hosted on Neon.

### Data Flow
Server components and API routes use the Payload Local API (`getPayload({ config })`) — no HTTP round-trip. Collections are defined in `collections/`.

### Training Application Flow
1. User selects activity (Schwimmen/Laufen) → fetches filtered events via `/api/event-options`
2. User submits form → POST `/api/register-trial-training`
3. Backend fetches email template via Payload based on training type + location
4. Sends confirmation via Resend API + admin notification

### Date Handling
- Payload stores dates as ISO 8601 UTC strings
- League event dates are formatted for display using `Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin' })`

### Payload Collections
- **Users** — admin users (auth)
- **Media** — general uploads, stored in Cloudflare R2 bucket root
- **LeagueMedia** — league team photos, stored in R2 under `league/` prefix
- **Locations** — training locations with address, image, and email template reference
- **EmailTemplates** — transactional email templates with `{{variable}}` placeholders
- **Trainings** — training sessions (date, discipline, location, capacity)
- **LeagueSeasons** — season with year, heading, caption, published flag; join → LeagueTeams
- **LeagueTeams** — team per season with image, overallPlacement; join → LeagueEvents
- **LeagueEvents** — individual race events with date, type, place, participants array

### Migrations
Migration files live in `next-js-frontend/migrations/`. Payload generates them by diffing the live DB schema against the collection definitions (`migrate:create`). The build script runs `payload migrate` automatically on deploy.

When making schema changes in dev: use `PAYLOAD_DB_PUSH=true pnpm dev` to auto-push, or generate + apply a migration manually.

### Storage
Images are stored in Cloudflare R2. The `@payloadcms/storage-s3` plugin handles uploads. `generateFileURL` constructs public URLs using `R2_PUBLIC_URL`.

## Key Conventions

### Styling
- Tailwind CSS with custom MTC colors: `mtc-black` (#464646), `mtc-yellow` (#FDE480), `mtc-background` (#ECECEC)
- Use Tailwind classes only — no inline `style={}` unless Tailwind can't express it
- Mobile-first responsive design

### Fonts
- **Findel** (local): Display/logo font (`--font-findel`)
- **Montserrat** (Google): Body text (`--font-montserrat`)
- **Caveat** (Google, 700): Handwritten accents (`--font-caveat`)

### Environment Variables
Frontend requires: `DATABASE_URL`, `PAYLOAD_SECRET`, `R2_BUCKET`, `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`

### News Articles
Static TypeScript objects in `app/news/articles/{year}/` — not from CMS.
