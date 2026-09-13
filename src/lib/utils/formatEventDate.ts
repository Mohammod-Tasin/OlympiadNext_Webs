/** The timezone every event date is displayed in (UTC+6). */
const EVENT_TIME_ZONE = "Asia/Dhaka";

/**
 * Formats an ISO 8601 instant for display in the event's timezone, e.g.
 * "Sep 24, 2026 • 04:00 PM". `Intl` handles the offset conversion from the
 * raw ISO string, so this is correct regardless of the server's own
 * timezone. An unparseable value is returned unchanged rather than dropped.
 */
export function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: EVENT_TIME_ZONE,
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: EVENT_TIME_ZONE,
  });
  return `${datePart} • ${timePart}`;
}
