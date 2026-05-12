# Strapi → Payload CMS Migration Plan

Migration of the MTC website CMS from Strapi v5 to [Payload CMS v3](https://payloadcms.com/docs).
Scope of this plan: only the **apply-training** use case (the only one currently in Strapi).
Further use cases (news articles, etc.) will follow later.

Package manager: **pnpm** (project already has `pnpm-lock.yaml`).

---

## 1. Database recommendation: Postgres

For this use case Postgres is the better fit over MongoDB:

| Aspect | Postgres (`@payloadcms/db-postgres`) | Mongo (`@payloadcms/db-mongodb`) |
|---|---|---|
| Relational fit | Excellent — trainings ↔ locations ↔ templates are inherently relational | Workable via embedded refs, but weaker |
| Migrations | First-class, generated SQL via Drizzle | Schemaless, no real migrations |
| Hosting | Neon, Supabase, Vercel Postgres, Railway (free tiers + branching) | MongoDB Atlas free tier |
| Payload docs status | Treated as the default for new projects | Original adapter, still fully supported |
| Type-safety end-to-end | Stronger (typed joins) | Slightly weaker |

**Pick Neon for hosting** — branchable DBs make Payload migrations painless on Vercel preview deployments.

---

## 2. Target data model

### Current Strapi flaws to fix

- `locationName` + `address` + `imageName` are duplicated on every training row — should be one `Location`.
- The email template is selected via string matching on `trainingType + locationName` in code
  (`app/api/apply-training/route.ts`) — fragile. Better: each `Location` has a direct relationship
  to its registration-confirmation `EmailTemplate`.
- `imageName` is a plain string pointing into `/public/` — should become a real Payload Media upload.

### Proposed collections

**`locations`** (new)
- `name` (text, required, unique)
- `slug` (text, required, unique)
- `address` (text)
- `image` (upload → `media`)
- `confirmationTemplate` (relationship → `email-templates`, required)

**`trainings`**
- `date` (date, required, timezone-aware)
- `discipline` (select: `Schwimmen` | `Laufen`, required)
- `location` (relationship → `locations`, required)
- `isDisabled` (checkbox, default false)
- `capacity` (number, optional — for future)

**`email-templates`**
- `name` (text, unique, required) — kept for the existing `trial_registration_notification` admin template
- `subject` (text, required)
- `html` (rich text or `code` field, required)
- `type` (select: `applicant_confirmation` | `admin_notification`) — lets you validate the right
  template is wired to a location

**`media`** — Payload's built-in uploads collection.

**`users`** — Payload default; admin login only.

**Out of scope, recommended later**: a `registrations` collection that actually persists applications
instead of fire-and-forget email.

---

## 3. Setup steps

### Step 1 — Install Payload into the existing Next.js app

Payload v3 runs **inside** the existing Next.js app at `next-js-frontend/`. There is no separate
process to deploy.

```bash
cd next-js-frontend
pnpm dlx create-payload-app@latest --name mtc-cms --template blank --db postgres .
```

If the installer refuses to write into a non-empty dir, use the manual install
(Payload docs → *Getting Started → Installation → Manual*):

```bash
pnpm add payload @payloadcms/next @payloadcms/db-postgres @payloadcms/richtext-lexical sharp graphql
```

Then follow the docs to add:
- `payload.config.ts` at `next-js-frontend/payload.config.ts`
- The admin route group `app/(payload)/` with the auto-generated files (admin UI + REST + GraphQL handlers)
- `withPayload()` wrapper in `next.config.ts` (or `.mjs`)
- TypeScript path alias `@payload-config` in `tsconfig.json`

Required envs (`.env.local`):

```
DATABASE_URI=postgres://...        # Neon connection string
PAYLOAD_SECRET=<random 32+ chars>
```

Prerequisites:
- Node ≥ 20.9
- Verify Payload's compatibility note lists support for Next.js 16 + React 19 before pinning.

### Step 2 — Configure `payload.config.ts`

```ts
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Trainings } from './collections/Trainings'
import { Locations } from './collections/Locations'
import { EmailTemplates } from './collections/EmailTemplates'
import { Media } from './collections/Media'
import { Users } from './collections/Users'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI! } }),
  editor: lexicalEditor(),
  collections: [Users, Media, Locations, EmailTemplates, Trainings],
  typescript: { outputFile: 'payload-types.ts' },
})
```

Each collection lives in `next-js-frontend/collections/<Name>.ts` exporting a `CollectionConfig`.

### Step 3 — Generate types & run admin

```bash
pnpm payload generate:types
pnpm dev
```

Admin UI: `http://localhost:3000/admin`. First load prompts to create the first admin user.

### Step 4 — Rewrite the two API routes to use Payload's Local API

The Local API runs in-process — no HTTP, no token.

Replace `app/api/event-options/route.ts`:

```ts
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const payload = await getPayload({ config })
  const start = new Date(); start.setDate(start.getDate() + 2)
  const end = new Date();   end.setDate(end.getDate() + 21)

  const { docs } = await payload.find({
    collection: 'trainings',
    where: {
      isDisabled: { equals: false },
      date: { greater_than_equal: start.toISOString(), less_than_equal: end.toISOString() },
    },
    sort: 'date',
    depth: 2,           // populates location + location.image
    limit: 100,
  })
  return Response.json(docs)
}
```

Replace `app/api/apply-training/route.ts`:

```ts
const training = await payload.findByID({
  collection: 'trainings', id: data.trainingId, depth: 2,
})
const applicantTpl = training.location.confirmationTemplate   // already populated
const adminTpl = (await payload.find({
  collection: 'email-templates',
  where: { name: { equals: 'trial_registration_notification' } },
  limit: 1,
})).docs[0]
// …render with the same {{var}} regex helper, send via Resend
```

This deletes the brittle string-matching template selection — the relationship enforces the right
template per location.

### Step 5 — Data migration (one-off)

Write a small script in `utils/` that:

1. Reads existing Strapi trainings + templates via REST.
2. Inserts unique locations (deduped by `locationName`), then templates, then trainings via
   Payload's Local API.

Alternatively, enter the few records manually in the new admin — the dataset is small.

### Step 6 — Frontend updates

- Replace `documentId` usage in `step1-activity.tsx` and siblings with Payload's `id` (number).
- Update the `EventOption` interface to match the Payload doc shape, or import the generated
  `Training` type from `payload-types.ts`.
- Drop `NEXT_PUBLIC_STRAPI_API_URL` / `STRAPI_API_TOKEN` from env.

### Step 7 — Deployment

- Add the Neon connection string and `PAYLOAD_SECRET` to Vercel.
- Run `payload migrate` in the build step:
  ```json
  "build": "payload migrate && next build"
  ```
- Decommission `strapi-cms-backend/` once parity in prod is verified.

---

## 4. Tradeoffs to know upfront

- **Cold starts**: serverless + Payload + Postgres connection pool needs care. Use Neon's pooler URL
  (`-pooler` host) for serverless functions.
- **`sharp` on Vercel**: Payload uses `sharp` for image processing — it must be in `dependencies`,
  not `devDependencies`.
- **No `draftAndPublish` parity by default**: Payload uses `versions: { drafts: true }` per collection
  — enable it where the Strapi draft/publish flow was relied on.
- **Admin auth**: Payload's admin is a real auth-gated app — no separate "admin token" is needed for
  the Local API.

---

## 5. Suggested first PR

Step 1 (install + scaffold) plus the three collection files (`Locations`, `EmailTemplates`,
`Trainings`), so Payload boots locally against a Neon DB and the admin UI is reachable before
any frontend route is touched.
