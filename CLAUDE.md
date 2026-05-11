# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a monorepo for the Munich Triathlon Club (MTC) website containing:
- **next-js-frontend/** - Next.js 16 frontend with React 19 and App Router
- **strapi-cms-backend/** - Strapi v5 headless CMS managing training events and email templates
- **utils/** - Data import/conversion scripts for Strapi content

## Commands

### Frontend (next-js-frontend/)
```bash
npm run dev          # Development with Turbopack
npm run build        # Production build
npm run lint         # ESLint
```

### Strapi Backend (strapi-cms-backend/)
```bash
npm run develop      # Development with auto-reload
npm run build        # Build admin panel
npm run start        # Production server
```

### Utils (utils/)
```bash
npm run build                           # Compile TypeScript
npm run convert:csv ./trainings.csv     # Convert UTC dates to Munich timezone
npm run import:trainings ./file.csv     # Import trainings to Strapi (add --prod for production)
npm run import:templates                # Import email templates
```

## Architecture

### Data Flow
Frontend API routes (`/api/*`) communicate with Strapi CMS, which uses SQLite (local) or Strapi Cloud (production).

### Training Application Flow
1. User selects activity (Schwimmen/Laufen) → fetches filtered events from Strapi
2. User submits form → POST `/api/apply-training`
3. Backend fetches email template based on training type + location (e.g., `swimming_bogenhausen_trial_registration_confirmation`)
4. Sends confirmation via Resend API + admin notification

### Date Handling
- Strapi stores dates in UTC
- Frontend converts to local timezone using `convertUTCToLocalTime()` in `app/utils/date-utils.ts`
- CSV imports require timezone offset (e.g., `+01:00`), not `Z` suffix

### Strapi Content Types
- **Training**: date, locationName, address, imageName, trainingType (Schwimmen|Laufen), isDisabled
- **Email Template**: name (unique identifier), subject, html (with `{{variable}}` placeholders)

## Key Conventions

### Styling
- Tailwind CSS with custom MTC colors: `mtc-black` (#464646), `mtc-yellow` (#FDE480), `mtc-background` (#ECECEC)
- Mobile-first responsive design using `react-responsive` for conditional rendering

### Fonts
- **Findel** (local): Display/logo font (`--font-findel`)
- **Montserrat** (Google): Body text (`--font-montserrat`)
- **Caveat** (Google, 700): Handwritten accents (`--font-caveat`)

### Environment Variables
Frontend requires: `NEXT_PUBLIC_STRAPI_API_URL`, `STRAPI_API_TOKEN`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`, `BLOB_READ_WRITE_TOKEN`

Utils require: `STRAPI_URL`, `STRAPI_ADMIN_TOKEN` (add `PROD_` prefix for production)

### News Articles
Static TypeScript objects in `app/news/articles/{year}/` - not from CMS.
