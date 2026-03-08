/**
 * Add timezone offset to CSV dates for Munich local time
 *
 * This script adds the correct timezone offset to training dates.
 * Munich uses:
 * - CET (UTC+01:00) from January 1 to last Sunday of March
 * - CEST (UTC+02:00) from last Sunday of March to last Sunday of October
 * - CET (UTC+01:00) from last Sunday of October to December 31
 *
 * The Z suffix is replaced with the appropriate offset so Strapi can parse it correctly.
 *
 * Usage: npm run convert:csv <path-to-csv>
 * Example: npm run convert:csv ./Termine_Training_MTC.csv
 *
 * Output: A new file will be created with "-converted" suffix
 */

import fs from "fs";
import path from "path";

function addMunichTimezoneOffset(dateString: string): string {
  // Parse the date string (expected format: 2026-03-01T19:30:00Z)
  const dateStr = dateString.replace("Z", "");
  const [datePart, timePart] = dateStr.split("T");

  if (!datePart || !timePart) {
    throw new Error(`Invalid ISO8601 date format: ${dateString}`);
  }

  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    throw new Error(`Invalid date format in: ${dateString}`);
  }

  // Determine DST: Munich uses CET (UTC+1) until last Sunday of March,
  // then CEST (UTC+2) until last Sunday of October
  const checkDate = new Date(Date.UTC(year, month - 1, day));
  const lastSundayMarch = getLastSundayUTC(year, 2); // March
  const lastSundayOctober = getLastSundayUTC(year, 9); // October

  // Check if date is in CEST period
  let tzOffset = "+01:00"; // CET default
  if (checkDate >= lastSundayMarch && checkDate < lastSundayOctober) {
    tzOffset = "+02:00"; // CEST
  }

  // Return datetime with the appropriate offset instead of Z
  return `${dateStr}${tzOffset}`;
}

function getLastSundayUTC(year: number, month: number): Date {
  // Get the last day of the month in UTC
  const lastDay = new Date(Date.UTC(year, month + 1, 0));

  // Go back to the previous Sunday
  while (lastDay.getUTCDay() !== 0) {
    lastDay.setUTCDate(lastDay.getUTCDate() - 1);
  }

  return new Date(Date.UTC(year, month, lastDay.getUTCDate()));
}

const csvPath = process.argv[2];
if (!csvPath) {
  console.error("Usage: npm run convert:csv <path-to-csv>");
  process.exit(1);
}

const absolutePath = path.resolve(csvPath);
const content = fs.readFileSync(absolutePath, "utf-8");
const lines = content.split("\n");

// Keep header, add offsets to dates in data rows
const convertedLines: string[] = [lines[0] || ""];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i] || "";
  if (!line.trim()) {
    convertedLines.push(line);
    continue;
  }

  const parts = line.split(";");
  if (parts[0]) {
    const originalDate = parts[0].trim();
    const convertedDate = addMunichTimezoneOffset(originalDate);
    parts[0] = convertedDate;
    console.log(`${originalDate} → ${convertedDate}`);
  }
  convertedLines.push(parts.join(";"));
}

const outputPath = absolutePath.replace(/\.csv$/, "-converted.csv");
fs.writeFileSync(outputPath, convertedLines.join("\n"), "utf-8");
console.log(`\nConverted CSV saved to: ${outputPath}`);
