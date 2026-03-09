# MTC Utils

Utility scripts for the MTC (Munich Triathlon Club) backend integration. These tools help manage data imports and transformations for the Strapi CMS.

## Available Scripts

### `npm run import:trainings <csv-path>`

Imports training events from a CSV file into Strapi.

**Format:** The CSV should have the following columns:

```
date;locationName;address;imageName;trainingType;
2026-03-01T19:30:00+01:00;<location>;<address>;<image>.png;swimming;
```

**Important:** Dates must include timezone offset (e.g., `+01:00` or `+02:00`). Use the `convert:csv` script to add offsets if you have dates with `Z` suffix.

**Example:**

```bash
npm run import:trainings /path/to/trainings.csv
```

**Requirements:**

- `.env` file with `STRAPI_URL` and `STRAPI_ADMIN_TOKEN`
- For production: `PROD_STRAPI_URL` and `PROD_STRAPI_ADMIN_TOKEN`

**Flags:**

- `--prod` - Use production environment variables

---

### `npm run import:templates`

Imports email templates from configured sources into Strapi.

**Requirements:**

- `.env` file with Strapi connection details
- Email template files in the expected format

---

### `npm run convert:csv <csv-path>`

Adds timezone offset to CSV dates for Munich local time.

This script replaces the `Z` suffix with the correct Munich timezone offset:

- **CET (UTC+01:00)** - January 1 to last Sunday of March, and last Sunday of October to December 31
- **CEST (UTC+02:00)** - Last Sunday of March to last Sunday of October

**Example:**

```bash
npm run convert:csv ./trainings.csv
```

**Output:** Creates a new file with `-converted` suffix (e.g., `trainings-converted.csv`)

Example transformation:

```
2026-03-01T19:30:00Z → 2026-03-01T19:30:00+01:00
2026-03-29T19:30:00Z → 2026-03-29T19:30:00+02:00 (DST starts)
```

**Why this is needed:** Strapi automatically converts timestamps with timezone offsets to UTC for storage. This ensures dates are stored and displayed correctly regardless of user timezone.

---

## Setup

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create a `.env` file in the utils directory:

```env
STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_TOKEN=your_admin_token_here

# Optional: Production environment
PROD_STRAPI_URL=https://your-production-domain.com
PROD_STRAPI_ADMIN_TOKEN=your_prod_admin_token_here
```

### TypeScript Build

```bash
npm run build
```

Compiles TypeScript files to JavaScript in the `dist` directory.

---

## Workflow Example

1. **Add timezone offsets to CSV dates:**

   ```bash
   npm run convert:csv ./trainings.csv
   ```

2. **Import the converted CSV into Strapi:**
   ```bash
   npm run import:trainings ./trainings-converted.csv
   ```

Strapi will automatically parse the timezone offsets and store dates in UTC.

---

## File Structure

```
src/
├── import-trainings.ts       # Training events importer
├── import-email-templates.ts # Email templates importer
└── convert-csv-dates.ts      # Adds timezone offsets to CSV dates
```

---

## Notes

- All dates in the database are stored in UTC for consistency
- Frontend automatically converts UTC times to user's local timezone using `convertUTCToLocalTime()` utility
- Use the convert script when importing dates with `Z` suffix to add proper timezone offsets
- DST automatically handled: March 29 switches from CET (+01:00) to CEST (+02:00), October 25 switches back
- The import scripts validate required fields before creating entries
- Failed imports are logged with error details for debugging
