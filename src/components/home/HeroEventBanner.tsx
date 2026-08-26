"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";

interface HeroEventBannerProps {
  config?: HeroEventConfig;
}

function EventImage({ imagePath, imageAlt }: { imagePath: string; imageAlt: string }) {
  const [failed, setFailed] = useState(!imagePath);

  if (failed) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl border border-black/5 bg-gradient-to-br from-olympiad-50 to-olympiad-100">
        <svg viewBox="0 0 24 24" fill="none" className="h-16 w-16 text-olympiad-500/40" aria-hidden="true">
          <path
            d="M4 5.5A1.5 1.5 0 015.5 4h13A1.5 1.5 0 0120 5.5v13a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 18.5v-13z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path d="M4 16l4.5-4.5a1.5 1.5 0 012.12 0L15 15.9m-1.5-1.4l1.38-1.38a1.5 1.5 0 012.12 0L20 15.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="9" r="1.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imagePath}
      alt={imageAlt}
      onError={() => setFailed(true)}
      className="aspect-square w-full rounded-3xl border border-black/5 object-cover shadow-[0_20px_60px_rgb(0,0,0,0.1)]"
    />
  );
}

export function HeroEventBanner({ config = heroConfig }: HeroEventBannerProps) {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
            Upcoming Event
          </span>

          <h1 className="text-4xl font-extrabold tracking-tight text-olympiad-900 sm:text-5xl">
            {config.subjectTitle}
          </h1>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white px-4 py-2 text-sm font-medium text-olympiad-800 shadow-[0_2px_10px_rgb(0,0,0,0.04)]">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-olympiad-500" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {config.eventDate}
          </div>

          <p className="max-w-lg text-lg text-olympiad-800/80">{config.description}</p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <Button variant="primary" size="lg" onClick={() => router.push(config.registerHref)}>
              {config.registerButtonText}
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push(config.detailsHref)}>
              {config.detailsButtonText}
            </Button>
          </div>
        </div>

        <div className="relative">
          <div
            className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-olympiad-500/10 blur-2xl"
            aria-hidden="true"
          />
          <EventImage imagePath={config.imagePath} imageAlt={config.imageAlt} />
        </div>
      </div>
    </section>
  );
}
