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

/**
 * Format date in German email format: dd.mm.yyyy um hh:mm
 * @param dateString - Date string (already in local timezone format from convertUTCToLocalTime)
 * @returns Formatted string (e.g., "01.03.2026 um 19:30")
 */
export function formatDateForEmail(dateString: string): string {
  // dateString is in format like "Montag, 1. März 2026 um 19:30 Uhr"
  // We need to parse it back to a Date object
  // Actually, better to accept ISO string and format it directly
  const date = new Date(dateString);
  
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${day}.${month}.${year} um ${hours}:${minutes}`;
}
