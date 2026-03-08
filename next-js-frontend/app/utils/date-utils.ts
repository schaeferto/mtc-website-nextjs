/**
 * Convert UTC datetime string to user's local timezone
 * @param utcDateString - ISO format datetime string (e.g., "2026-03-01T18:30:00.000Z")
 * @returns Formatted string in user's local timezone in German format (e.g., "Montag, 1. März 2026 um 19:30 Uhr")
 */
export function convertUTCToLocalTime(utcDateString: string): string {
  const date = new Date(utcDateString);

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

/**
 * Get the raw date in user's local timezone (useful for date inputs)
 * @param utcDateString - ISO format datetime string
 * @returns Date object in user's local timezone
 */
export function getLocalDate(utcDateString: string): Date {
  return new Date(utcDateString);
}
