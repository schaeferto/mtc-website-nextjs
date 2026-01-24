
import fs from 'fs';
import path from 'path';

/**
 * Script to import trainings from a CSV file
 * Run with: npm run seed:trainings <path-to-csv>
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_ADMIN_TOKEN = process.env.STRAPI_ADMIN_TOKEN || "";

if (!STRAPI_ADMIN_TOKEN) {
    console.error("Error: STRAPI_ADMIN_TOKEN environment variable is required.");
    process.exit(1);
}

const csvFilePath = process.argv[2];

if (!csvFilePath) {
    console.error("Error: Please provide the path to the CSV file.");
    console.error("Usage: npm run seed:trainings <path-to-csv>");
    process.exit(1);
}

interface Training {
    date: string;
    address: string;
    locationName: string;
    imageName: string;
    trainingType: 'swimming' | 'running';
    [key: string]: any;
}

function parseCSV(content: string): Training[] {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const results: Training[] = [];

    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Handle simple comma separation; quote handling is minimal for this usecase
        const values = line.split(',').map(v => v.trim());
        const entry: any = {};

        headers.forEach((header, index) => {
            entry[header] = values[index];
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
        const content = fs.readFileSync(absolutePath, 'utf-8');
        const trainings = parseCSV(content);

        console.log(`Found ${trainings.length} trainings to import.`);

        let successCount = 0;
        let failCount = 0;

        for (const training of trainings) {
            // Validate required fields
            if (!training.date || !training.locationName || !training.trainingType) {
                console.warn(`Skipping invalid entry (missing required fields): ${JSON.stringify(training)}`);
                failCount++;
                continue;
            }

            if (!['swimming', 'running'].includes(training.trainingType)) {
                console.warn(`Skipping invalid entry (invalid trainingType "${training.trainingType}"): ${JSON.stringify(training)}`);
                failCount++;
                continue;
            }

            try {
                const response = await fetch(`${STRAPI_URL}/api/trainings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${STRAPI_ADMIN_TOKEN}`,
                    },
                    body: JSON.stringify({
                        data: training,
                    }),
                });

                if (response.ok) {
                    console.log(`✓ Imported training at ${training.locationName} on ${training.date}`);
                    successCount++;
                } else {
                    const error = await response.json();
                    console.error(`✗ Failed to import training:`, error);
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
