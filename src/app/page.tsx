import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroEventBanner } from "@/components/home/HeroEventBanner";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";
import { AboutShikhor } from "@/components/home/AboutShikhor";
import { Champions } from "@/components/home/Champions";
import { SectionSkeleton } from "@/components/ui/SectionSkeleton";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";
import { getActiveEvent } from "@/lib/api/eventsApi";
import { formatEventDate } from "@/lib/utils/formatEventDate";

export const metadata: Metadata = {
  title: "OlympiadNext",
  description: "Discover upcoming academic olympiads, register your school, and track important exam dates.",
};

export default async function HomePage() {
  const event = await getActiveEvent();

  // The API drives the event's text and dates; the hero image is always the
  // bundled static asset (backend image uploads were removed). When there is
  // no active event, heroConfig stands in entirely.
  let config: HeroEventConfig = heroConfig;
  if (event) {
    config = {
      ...heroConfig,
      eventId: event.id || undefined,
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
      <Suspense fallback={<SectionSkeleton heightClassName="h-56" />}>
        <NoticeBoard />
      </Suspense>
      <HowToParticipate />
      <Suspense
        fallback={
          <SectionSkeleton className="bg-olympiad-800" blockClassName="bg-white/10" heightClassName="h-96" />
        }
      >
        <Timeline />
      </Suspense>
      <AboutShikhor />
      <Champions />
    </div>
  );
}
