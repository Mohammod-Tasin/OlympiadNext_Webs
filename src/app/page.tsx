import { HeroEventBanner } from "@/components/home/HeroEventBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";
import { getActiveEvent } from "@/lib/api/eventsApi";

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

export default async function HomePage() {
  const event = await getActiveEvent();

  // The API drives the event's text and dates; the hero image is always the
  // bundled static asset (backend image uploads were removed). When there is
  // no active event, heroConfig stands in entirely.
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
      image: heroConfig.image,
      imageAlt: heroConfig.imageAlt,
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
