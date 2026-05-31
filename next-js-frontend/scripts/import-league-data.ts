/**
 * Import league data into Payload (new schema: league-seasons, league-teams, league-media, league-events).
 *
 * Run from next-js-frontend/:
 *   pnpm import:league
 *
 * Idempotent: re-running skips entries that already exist.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getPayload } from "payload";
import config from "@payload-config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.resolve(__dirname, "../public");

// Map (teamName + '|' + year) → image filename in public/.
const IMAGE_FILENAMES: Record<string, string> = {
  "Bayernliga Damen|2025": "bayernliga_damen_2025.jpg",
  "Bayernliga Herren|2025": "bayernliga_herren_2025.jpg",
  "Landesliga Süd Herren|2025": "landesliga_sued_herren_2025.jpg",
  "Bayernliga Damen|2024": "bayernliga_damen_2024.jpg",
  "Landesliga Süd Herren|2024": "bayernliga_herren_2024.jpg",
};

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext] ?? "application/octet-stream";
}

// German month names → month index (1-based)
const GERMAN_MONTHS: Record<string, number> = {
  Januar: 1, Februar: 2, März: 3, April: 4, Mai: 5, Juni: 6,
  Juli: 7, August: 8, September: 9, Oktober: 10, November: 11, Dezember: 12,
};

/**
 * Parse a German date string like "10. Mai 2025" or "12. und 13. Juli 2025" into an ISO date string.
 * For multi-day entries, takes the first date.
 */
function parseGermanDate(str: string): string {
  const match = str.match(/(\d+)\.\s+(\w+)\s+(\d{4})/);
  if (!match) throw new Error(`Cannot parse date: "${str}"`);
  const day = parseInt(match[1], 10);
  const month = GERMAN_MONTHS[match[2]];
  const year = parseInt(match[3], 10);
  if (!month) throw new Error(`Unknown month "${match[2]}" in: "${str}"`);
  return new Date(Date.UTC(year, month - 1, day)).toISOString();
}

async function uploadLeagueMedia(
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
    collection: "league-media",
    where: { filename: { equals: imageName } },
    limit: 1,
  });
  if (existing.docs[0]) {
    console.log(`  league-media "${imageName}" already exists (id ${existing.docs[0].id})`);
    return existing.docs[0].id;
  }

  const fileBuffer = fs.readFileSync(imagePath);
  const doc = await payload.create({
    collection: "league-media",
    data: { alt: altText },
    file: {
      data: fileBuffer,
      mimetype: getMimeType(imageName),
      name: imageName,
      size: fileBuffer.length,
    },
  });
  console.log(`  ✓ Uploaded league-media "${imageName}" (id ${doc.id})`);
  return doc.id;
}

// ---------------------------------------------------------------------------
// Source data (inlined — avoids importing the Next.js static-image module)
// ---------------------------------------------------------------------------

type ResultRecord = { text: string; date?: string; type?: string; place?: string };
type TeamRecord = { name: string; overall?: string; results: ResultRecord[] };
type AnnualRecord = { year: string; isCurrentYear?: boolean; teams: TeamRecord[] };

const annualResults: AnnualRecord[] = [
  {
    isCurrentYear: true,
    year: "2025",
    teams: [
      {
        name: "Bayernliga Damen",
        results: [
          { text: "Triathlon Weiden", date: "10. Mai 2025", type: "Supersprint mit Mannschaftsverfolgung" },
          { text: "GEALAN Triathlon der IfL Hof", date: "12. und 13. Juli 2025", type: "Team Relay mit Wertung zur Bayrischen Meisterschaft und Kurzdistanz mit Windschatten" },
          { text: "Schongau Triathlon", date: "27. Juli 2025", type: "Mannschaftssprint" },
        ],
      },
      {
        name: "Bayernliga Herren",
        results: [
          { text: "Triathlon Weiden", date: "10. Mai 2025", type: "Supersprint mit Mannschaftsverfolgung" },
          { text: "GEALAN Triathlon der IfL Hof", date: "12. und 13. Juli 2025", type: "Team Relay mit Wertung zur Bayrischen Meisterschaft und Kurzdistanz mit Windschattenfreigabe" },
          { text: "Schongau Triathlon", date: "27. Juli 2025", type: "Mannschaftssprint" },
        ],
      },
      {
        name: "Landesliga Süd Herren",
        results: [
          { text: "triathlon.de CUP München/Oberschleißheim", date: "25. Mai 2025", type: "Mannschaftswettkampf" },
          { text: "Stadttriathlon Erding", date: "01. Juni 2025", type: "Kurzdistanz mit Windschattenverbot" },
          { text: "triathlon.de CUP Landshut", date: "22. Juni 2025", type: "Sprintdistanz mit Windschattenverbot" },
          { text: "Ammersee Triathlon", date: "12. Juli 2025", type: "Sprintdistanz mit Windschattenfreigabe" },
        ],
      },
    ],
  },
  {
    year: "2024",
    teams: [
      {
        name: "Bayernliga Damen",
        overall: "8. Platz",
        results: [
          { text: "Weiden", date: "04. Mai 2024", place: "9" },
          { text: "Hof", date: "13. und 14. Juli 2024", place: "8" },
          { text: "Schongau", date: "21. Juli 2024", place: "6" },
        ],
      },
      {
        name: "Landesliga Süd Herren",
        overall: "1. Platz",
        results: [
          { text: "Oberschleißheim", date: "12. Mai 2024", place: "2" },
          { text: "Bad Tölz", date: "09. Juni 2024", place: "3" },
          { text: "Erding", date: "16. Juni 2024", place: "2" },
          { text: "Ammersee", date: "13. Juli 2024", place: "2" },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const payload = await getPayload({ config });

console.log("\nImporting league data → Payload\n");

let seasonsCreated = 0, seasonsSkipped = 0;
let teamsCreated = 0, teamsSkipped = 0;
let eventsCreated = 0, eventsSkipped = 0;

for (const annual of annualResults) {
  const year = Number(annual.year);

  // --- Season ---
  const existingSeason = await payload.find({
    collection: "league-seasons",
    where: { year: { equals: year } },
    limit: 1,
  });

  let seasonId: number;
  if (existingSeason.docs[0]) {
    console.log(`  season ${year} already exists (id ${existingSeason.docs[0].id})`);
    seasonId = existingSeason.docs[0].id;
    seasonsSkipped++;
  } else {
    const season = await payload.create({
      collection: "league-seasons",
      data: {
        year,
        heading: `Saison ${year}`,
        published: true,
      },
    });
    console.log(`  ✓ Created season ${year} (id ${season.id})`);
    seasonId = season.id;
    seasonsCreated++;
  }

  console.log(`\n[${year}] ${annual.teams.length} team(s)`);

  for (const [teamIndex, team] of annual.teams.entries()) {
    // --- League-media ---
    const filename = IMAGE_FILENAMES[`${team.name}|${year}`];
    let imageId: number | null = null;
    if (filename) {
      imageId = await uploadLeagueMedia(payload, filename, team.name);
    }

    // --- League team ---
    const existingTeam = await payload.find({
      collection: "league-teams",
      where: {
        and: [
          { name: { equals: team.name } },
          { season: { equals: seasonId } },
        ],
      },
      limit: 1,
    });

    let teamId: number;
    if (existingTeam.docs[0]) {
      console.log(`  team "${team.name}" already exists (id ${existingTeam.docs[0].id})`);
      teamId = existingTeam.docs[0].id;
      teamsSkipped++;
    } else {
      const doc = await payload.create({
        collection: "league-teams",
        data: {
          name: team.name,
          season: seasonId,
          ...(imageId !== null ? { image: imageId } : {}),
          ...(team.overall ? { overallPlacement: team.overall } : {}),
          displayOrder: teamIndex,
        },
      });
      console.log(`  ✓ Created team "${team.name}" (id ${doc.id})`);
      teamId = doc.id;
      teamsCreated++;
    }

    // --- Events ---
    for (const [resultIndex, result] of team.results.entries()) {
      const existingEvent = await payload.find({
        collection: "league-events",
        where: {
          and: [
            { league: { equals: teamId } },
            { eventName: { equals: result.text } },
          ],
        },
        limit: 1,
      });

      if (existingEvent.docs[0]) {
        eventsSkipped++;
        continue;
      }

      await payload.create({
        collection: "league-events",
        data: {
          league: teamId,
          eventName: result.text,
          eventDate: result.date ? parseGermanDate(result.date) : new Date().toISOString(),
          ...(result.type ? { eventType: result.type } : {}),
          ...(result.place ? { place: result.place } : {}),
          displayOrder: resultIndex,
        },
      });
      eventsCreated++;
    }
  }
}

console.log("\n--- Summary ---");
console.log(`  Seasons : ${seasonsCreated} created, ${seasonsSkipped} skipped`);
console.log(`  Teams   : ${teamsCreated} created, ${teamsSkipped} skipped`);
console.log(`  Events  : ${eventsCreated} created, ${eventsSkipped} skipped`);
console.log("\nImport complete ✓");
process.exit(0);
