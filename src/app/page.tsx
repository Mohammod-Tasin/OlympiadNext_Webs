import { HeroEventBanner } from "@/components/home/HeroEventBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";
import { getActiveEvent } from "@/lib/api/eventsApi";

/**
 * Renders an ISO instant as e.g. "Sep 15, 2026 • 10:00 AM", using the
 * wall-clock time written in the string's own UTC offset rather than the
 * server's local timezone. We shift the instant by the parsed offset and
 * then format as UTC so the result is stable regardless of where it runs.
 */
function formatEventDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const offsetMatch = iso.match(/([+-])(\d{2}):?(\d{2})$/);
  const offsetMinutes = offsetMatch
    ? (offsetMatch[1] === "-" ? -1 : 1) *
      (Number(offsetMatch[2]) * 60 + Number(offsetMatch[3]))
    : 0;
  const shifted = new Date(date.getTime() + offsetMinutes * 60_000);

  const datePart = shifted.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
  const timePart = shifted.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
  return `${datePart} • ${timePart}`;
}

export default async function HomePage() {
  const event = await getActiveEvent();

  // Live event data wins; the static heroConfig fills the fields the API
  // does not supply (button copy + links) and stands in entirely when
  // there is no active event.
  const config: HeroEventConfig = event
    ? {
        ...heroConfig,
        title: event.title,
        description: event.description || heroConfig.description,
        eventDate: formatEventDate(event.event_date) || heroConfig.eventDate,
        eventDateISO: event.event_date,
        image: event.image_url || heroConfig.image,
        imageAlt: event.title,
      }
    : heroConfig;

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
