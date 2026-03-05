import fs from "fs";
import path from "path";

/**
 * Script to import trainings from a CSV file
 * Run with: npm run import:trainings <path-to-csv> [--prod]
 * --prod uses PROD_STRAPI_URL and PROD_STRAPI_ADMIN_TOKEN environment variables
 */

// Check for --prod flag
const isProd = process.argv.includes("--prod");
const envPrefix = isProd ? "PROD_" : "";
const environment = isProd ? "production" : "local development";

const STRAPI_URL =
  process.env[`${envPrefix}STRAPI_URL`] || "http://localhost:1337";
const STRAPI_ADMIN_TOKEN = process.env[`${envPrefix}STRAPI_ADMIN_TOKEN`] || "";

if (!STRAPI_ADMIN_TOKEN) {
  console.error(
    `Error: ${envPrefix}STRAPI_ADMIN_TOKEN environment variable is required.`,
  );
  process.exit(1);
}

console.log(`Running in ${environment} mode using ${STRAPI_URL}`);

// Parse CSV file path, excluding flags
const csvFilePath: string =
  process.argv.slice(2).filter((arg) => !arg.startsWith("--"))[0] || "";

if (!csvFilePath) {
  console.error("Error: Please provide the path to the CSV file.");
  console.error("Usage: npm run import:trainings <path-to-csv> [--prod]");
  process.exit(1);
}

interface Training {
  date: string;
  address: string;
  locationName: string;
  imageName: string;
  trainingType: "swimming" | "running";
  [key: string]: any;
}

function parseCSV(content: string): Training[] {
  const lines = content.trim().split("\n");
  if (lines.length < 2) return [];

  const headerLine = lines[0];
  if (!headerLine) return [];

  const headers = headerLine
    .split(";")
    .map((h) => h.trim())
    .filter((h) => h.length > 0); // Remove empty headers

  console.log(`CSV Headers: ${headers.join(", ")}`);

  const results: Training[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim();
    if (!line) continue;

    const values = line.split(";").map((v) => v.trim());
    const entry: any = {};

    headers.forEach((header, index) => {
      if (values[index]) {
        entry[header] = values[index];
      }
    });

    results.push(entry as Training);
  }

  return results;
}

async function importTrainings() {
  try {
    const absolutePath = path.resolve(csvFilePath);
    if (!fs.existsSync(absolutePath)) {
      console.error(`Error: File not found at ${absolutePath}`);
      process.exit(1);
    }

    console.log(`Reading CSV from ${absolutePath}...`);
    const content = fs.readFileSync(absolutePath, "utf-8");
    const trainings = parseCSV(content);

    console.log(`Found ${trainings.length} trainings to import.`);

    let successCount = 0;
    let failCount = 0;

    for (const training of trainings) {
      // Validate required fields
      if (!training.date || !training.locationName || !training.trainingType) {
        console.warn(
          `Skipping invalid entry (missing required fields): ${JSON.stringify(training)}`,
        );
        failCount++;
        continue;
      }

      if (!["swimming", "running"].includes(training.trainingType)) {
        console.warn(
          `Skipping invalid entry (invalid trainingType "${training.trainingType}"): ${JSON.stringify(training)}`,
        );
        failCount++;
        continue;
      }

      try {
        const response = await fetch(`${STRAPI_URL}/api/trainings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${STRAPI_ADMIN_TOKEN}`,
          },
          body: JSON.stringify({
            data: training,
          }),
        });

        if (response.ok) {
          console.log(
            `✓ Imported training at ${training.locationName} on ${training.date}`,
          );
          successCount++;
        } else {
          const contentType = response.headers.get("content-type");
          let error: any;

          if (contentType?.includes("application/json")) {
            error = await response.json();
          } else {
            // Response is HTML or plain text (likely an error page)
            const text = await response.text();
            error = {
              status: response.status,
              statusText: response.statusText,
              message: text.substring(0, 200), // Show first 200 chars
            };
          }

          console.error(
            `✗ Failed to import training (${response.status}):`,
            error,
          );
          failCount++;
        }
      } catch (err) {
        console.error(`✗ Error importing training:`, err);
        failCount++;
      }
    }

    console.log(`\nImport complete.`);
    console.log(`Success: ${successCount}`);
    console.log(`Failed: ${failCount}`);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
}

importTrainings();
