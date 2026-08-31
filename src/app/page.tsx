import { HeroEventBanner } from "@/components/home/HeroEventBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";
import { getActiveEvent, API_BASE_URL } from "@/lib/api/eventsApi";

/** The timezone every event date is displayed in (UTC+6). */
const EVENT_TIME_ZONE = "Asia/Dhaka";

/**
 * Formats an ISO 8601 instant for display in the event's timezone, e.g.
 * "Sep 24, 2026 • 04:00 PM". `Intl` handles the offset conversion from the
 * raw ISO string, so this is correct regardless of the server's own
 * timezone. An unparseable value is returned unchanged rather than dropped.
 */
function formatEventDate(iso: string): string {
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

/**
 * Uploaded event images come back as backend-relative paths (`/uploads/...`).
 * Prepend the API origin so the browser fetches them from the Go backend
 * rather than from the Next.js app's own origin. Absolute URLs and bundled
 * assets under `/assets/...` are left untouched.
 */
function resolveImageUrl(url: string): string {
  return url.startsWith("/uploads/") ? `${API_BASE_URL}${url}` : url;
}

export default async function HomePage() {
  const event = await getActiveEvent();

  // Live event data wins outright. The static heroConfig only supplies the
  // fields the API does not return (button copy + links); when there is no
  // active event it stands in entirely.
  let config: HeroEventConfig = heroConfig;
  if (event) {
    config = {
      ...heroConfig,
      title: event.title,
      description: event.description || heroConfig.description,
      // The backend enforces ISO 8601 — pass the exact instant straight to
      // the countdown timer, and derive the display string from it. Neither
      // falls back to the static date.
      eventDateISO: event.event_date,
      eventDate: formatEventDate(event.event_date),
      image: resolveImageUrl(event.image_url) || heroConfig.image,
      imageAlt: event.title,
    };
  }

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <HeroEventBanner config={config} />
      <StatsSection />
      <NoticeBoard />
      <HowToParticipate />
      <Timeline />
    </div>
  );
}
