/**
 * Migrate data from Strapi v5 → Payload CMS v3
 *
 * Reads  : trainings, email-templates from Strapi REST API
 * Writes : email-templates, media, locations, trainings via Payload Local API
 *
 * Run from next-js-frontend/:
 *   pnpm migrate:from-strapi
 *
 * Env vars (already in .env):
 *   NEXT_PUBLIC_STRAPI_API_URL  Strapi base URL
 *   STRAPI_API_TOKEN            Strapi API token
 *   DATABASE_URL, PAYLOAD_SECRET, R2_* (Payload — already present)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "@payload-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Location images are in next-js-frontend/public/
const PUBLIC_DIR = path.resolve(__dirname, "../public");

// ---------------------------------------------------------------------------
// Env
// ---------------------------------------------------------------------------

const STRAPI_URL = process.env["NEXT_PUBLIC_STRAPI_API_URL"] ?? "http://localhost:1337";
const STRAPI_TOKEN = process.env["STRAPI_API_TOKEN"] ?? "";

if (!STRAPI_TOKEN) {
  console.error("Missing env var: STRAPI_API_TOKEN");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Strapi types (v5 flat format — fields at top level, not under attributes)
// ---------------------------------------------------------------------------

interface StrapiTraining {
  id: number;
  date: string;
  locationName: string;
  address: string | null;
  imageName: string | null;
  trainingType: "Schwimmen" | "Laufen";
  isDisabled: boolean | null;
}

interface StrapiEmailTemplate {
  id: number;
  name: string;
  subject: string;
  html: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

/**
 * Derives the Payload template name from discipline + location name.
 * Matches the naming convention in utils/src/import-email-templates.ts:
 *   Schwimmen + Bogenhausen      → swimming_bogenhausen_trial_registration_confirmation
 *   Laufen    + Englischer Garten → running_englischergarten_trial_registration_confirmation
 */
function toTemplateName(
  discipline: "Schwimmen" | "Laufen",
  locationName: string,
): string {
  const prefix = discipline === "Schwimmen" ? "swimming" : "running";
  const locPart = locationName
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]/g, ""); // remove spaces + special chars, no separator
  return `${prefix}_${locPart}_trial_registration_confirmation`;
}

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
  };
  return map[ext] ?? "application/octet-stream";
}

function locationKey(locationName: string, discipline: "Schwimmen" | "Laufen"): string {
  return `${locationName}__${discipline}`;
}

// ---------------------------------------------------------------------------
// Strapi fetch helpers
// ---------------------------------------------------------------------------

async function strapiGet<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${STRAPI_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Strapi GET ${endpoint} → ${res.status}`);
  return res.json() as Promise<T>;
}

async function fetchStrapiTrainings(): Promise<StrapiTraining[]> {
  const all: StrapiTraining[] = [];
  let page = 1;

  while (true) {
    const data = await strapiGet<{
      data: StrapiTraining[];
      meta: { pagination: { pageCount: number } };
    }>(`/api/trainings?pagination[page]=${page}&pagination[pageSize]=100&sort=date:asc`);

    all.push(...data.data);
    if (page >= data.meta.pagination.pageCount) break;
    page++;
  }

  console.log(`  Fetched ${all.length} trainings from Strapi`);
  return all;
}

async function fetchStrapiEmailTemplates(): Promise<StrapiEmailTemplate[]> {
  const data = await strapiGet<{ data: StrapiEmailTemplate[] }>(
    `/api/email-templates?pagination[pageSize]=100`,
  );
  console.log(`  Fetched ${data.data.length} email templates from Strapi`);
  return data.data;
}

// ---------------------------------------------------------------------------
// Migration steps
// ---------------------------------------------------------------------------

async function syncEmailTemplates(
  payload: Awaited<ReturnType<typeof getPayload>>,
  strapiTemplates: StrapiEmailTemplate[],
): Promise<Map<string, number>> {
  const nameToId = new Map<string, number>();

  for (const t of strapiTemplates) {
    const existing = await payload.find({
      collection: "email-templates",
      where: { name: { equals: t.name } },
      limit: 1,
    });

    if (existing.docs[0]) {
      console.log(`  email-template "${t.name}" already exists (id ${existing.docs[0].id})`);
      nameToId.set(t.name, existing.docs[0].id);
      continue;
    }

    const type =
      t.name === "trial_registration_notification"
        ? "admin_notification"
        : "applicant_confirmation";

    const doc = await payload.create({
      collection: "email-templates",
      data: { name: t.name, type, subject: t.subject, html: t.html },
    });
    console.log(`  ✓ Created email-template "${t.name}" (id ${doc.id})`);
    nameToId.set(t.name, doc.id);
  }

  return nameToId;
}

async function uploadMedia(
  payload: Awaited<ReturnType<typeof getPayload>>,
  imageName: string,
  altText: string,
): Promise<number | null> {
  const imagePath = path.join(PUBLIC_DIR, imageName);
  if (!fs.existsSync(imagePath)) {
    console.warn(`  ⚠ Image not found: ${imagePath} — skipping`);
    return null;
  }

  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: imageName } },
    limit: 1,
  });

  if (existing.docs[0]) {
    console.log(`  media "${imageName}" already exists (id ${existing.docs[0].id})`);
    return existing.docs[0].id;
  }

  const fileBuffer = fs.readFileSync(imagePath);

  const doc = await payload.create({
    collection: "media",
    data: { alt: altText },
    file: {
      data: fileBuffer,
      mimetype: getMimeType(imageName),
      name: imageName,
      size: fileBuffer.length,
    },
  });
  console.log(`  ✓ Uploaded media "${imageName}" (id ${doc.id})`);
  return doc.id;
}

interface LocationData {
  locationName: string;
  discipline: "Schwimmen" | "Laufen";
  address: string | null;
  imageName: string | null;
}

async function syncLocations(
  payload: Awaited<ReturnType<typeof getPayload>>,
  locations: Map<string, LocationData>,
  templateNameToId: Map<string, number>,
): Promise<Map<string, number>> {
  const keyToId = new Map<string, number>();

  for (const [key, loc] of locations) {
    const existing = await payload.find({
      collection: "locations",
      where: {
        and: [
          { name: { equals: loc.locationName } },
          { slug: { equals: `${toSlug(loc.locationName)}-${loc.discipline === "Schwimmen" ? "swim" : "run"}` } },
        ],
      },
      limit: 1,
    });

    if (existing.docs[0]) {
      console.log(`  location "${loc.locationName} (${loc.discipline})" already exists (id ${existing.docs[0].id})`);
      keyToId.set(key, existing.docs[0].id);
      continue;
    }

    let imageId: number | undefined;
    if (loc.imageName) {
      const id = await uploadMedia(payload, loc.imageName, loc.locationName);
      if (id !== null) imageId = id;
    }

    const templateName = toTemplateName(loc.discipline, loc.locationName);
    const templateId = templateNameToId.get(templateName);
    if (!templateId) {
      console.warn(
        `  ⚠ No template found for "${templateName}" — skipping location "${loc.locationName} (${loc.discipline})" (confirmationTemplate is required)`,
      );
      continue;
    }

    const slug = `${toSlug(loc.locationName)}-${loc.discipline === "Schwimmen" ? "swim" : "run"}`;

    const doc = await payload.create({
      collection: "locations",
      data: {
        name: loc.locationName,
        slug,
        ...(loc.address ? { address: loc.address } : {}),
        ...(imageId !== undefined ? { image: imageId } : {}),
        confirmationTemplate: templateId,
      },
    });
    console.log(`  ✓ Created location "${loc.locationName} (${loc.discipline})" (id ${doc.id})`);
    keyToId.set(key, doc.id);
  }

  return keyToId;
}

async function syncTrainings(
  payload: Awaited<ReturnType<typeof getPayload>>,
  strapiTrainings: StrapiTraining[],
  locationKeyToId: Map<string, number>,
): Promise<void> {
  let created = 0;
  let skipped = 0;

  for (const t of strapiTrainings) {
    const key = locationKey(t.locationName, t.trainingType);
    const locationId = locationKeyToId.get(key);

    if (!locationId) {
      console.warn(`  ⚠ No location for key "${key}" — skipping training on ${t.date}`);
      skipped++;
      continue;
    }

    const existing = await payload.find({
      collection: "trainings",
      where: {
        and: [
          { date: { equals: t.date } },
          { location: { equals: locationId } },
        ],
      },
      limit: 1,
    });

    if (existing.docs[0]) {
      skipped++;
      continue;
    }

    await payload.create({
      collection: "trainings",
      data: {
        date: t.date,
        discipline: t.trainingType,
        location: locationId,
        isDisabled: t.isDisabled ?? false,
      },
    });
    created++;
  }

  console.log(`  ✓ Trainings: ${created} created, ${skipped} skipped`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const payload = await getPayload({ config });

console.log(`\nMigrating Strapi (${STRAPI_URL}) → Payload\n`);

console.log("[1/4] Fetching Strapi data...");
const [strapiTemplates, strapiTrainings] = await Promise.all([
  fetchStrapiEmailTemplates(),
  fetchStrapiTrainings(),
]);

console.log("\n[2/4] Syncing email templates...");
const templateNameToId = await syncEmailTemplates(payload, strapiTemplates);

console.log("\n[3/4] Syncing locations...");
const locationMap = new Map<string, LocationData>();
for (const t of strapiTrainings) {
  const key = locationKey(t.locationName, t.trainingType);
  if (!locationMap.has(key)) {
    locationMap.set(key, {
      locationName: t.locationName,
      discipline: t.trainingType,
      address: t.address,
      imageName: t.imageName,
    });
  }
}
console.log(`  ${locationMap.size} unique (location, discipline) combinations`);
const locationKeyToId = await syncLocations(payload, locationMap, templateNameToId);

console.log("\n[4/4] Syncing trainings...");
await syncTrainings(payload, strapiTrainings, locationKeyToId);

console.log("\nMigration complete ✓");
process.exit(0);
