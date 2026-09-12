"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { useAuth } from "@/lib/auth/useAuth";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";
import heroBackground from "@/assets/hero-newton-cradle.webp";

interface HeroEventBannerProps {
  config?: HeroEventConfig;
}

/**
 * Full-bleed hero. The event illustration is anchored to its left-centre,
 * so the Newton's cradle (which lives in the left third of the 16:9
 * artwork) stays framed and vertically centred at every viewport aspect
 * ratio — a `center`/`bottom` anchor cropped it away on portrait screens.
 *
 * - lg+: cradle clear on the left; copy occupies the right 50% over a
 *   left→right "transparent → white" readability gradient.
 * - < lg: the copy collapses to a centred frosted card so it stays legible
 *   wherever it overlaps the image.
 *
 * The artwork is rendered through `next/image` (a `fill` background layer),
 * replacing the former 1.7 MB inline-SVG raster that was set as a CSS
 * `background-image`. `objectPosition` reproduces the old
 * `background-position: 10% 50%` anchor exactly, so framing is unchanged.
 */
export function HeroEventBanner({ config = heroConfig }: HeroEventBannerProps) {
  const router = useRouter();
  const { status } = useAuth();

  // Whether the signed-in student already has a registration for this event.
  // The event payload is public/ISR-cached and carries no per-user state, so
  // this is derived from the authenticated `GET /api/user/registrations` —
  // the same call the dashboard and payment page use. Stays `false` while
  // logged out or loading, so the default "Register Now" path is unchanged.
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    if (status !== "authenticated" || !config.eventId) {
      setIsRegistered(false);
      return;
    }
    let cancelled = false;
    getMyRegistrations()
      .then((rows) => {
        if (!cancelled) setIsRegistered(rows.some((r) => r.event_id === config.eventId));
      })
      .catch(() => {
        if (!cancelled) setIsRegistered(false);
      });
    return () => {
      cancelled = true;
    };
  }, [status, config.eventId]);

  // "Register Now" opens the rules/terms page; the user reviews them and then
  // continues to the (login-gated) payment step from there.
  function handleRegisterClick() {
    router.push(config.registerHref);
  }

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full overflow-hidden">
      <Image
        src={heroBackground}
        alt=""
        aria-hidden="true"
        fill
        preload
        sizes="100vw"
        placeholder="blur"
        className="object-cover"
        style={{ objectPosition: "10% 50%" }}
      />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center px-4 py-16 sm:px-6">
        {/* Desktop-only readability gradient. Anchored to the max-w-6xl
            content zone (plus a 10rem bleed past its right edge) rather than
            spanning the full-bleed section: the white plateau sits behind the
            copy and then fades back to transparent in the margin, so on very
            wide screens the artwork fills both sides instead of the copy
            floating against an empty white slab — and there is no hard seam
            where the wash would otherwise meet the image. The left ~45% stays
            fully transparent so the Newton's cradle reads at full clarity. On
            < lg there is no wash — the frosted card carries contrast. */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 -right-40 hidden bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,0)_45%,rgba(255,255,255,0.95)_76%,rgba(255,255,255,0.95)_88%,rgba(255,255,255,0))] lg:block"
          aria-hidden="true"
        />

        {/* Positioning wrapper: dead-centre vertically, right half on lg+. */}
        <div className="relative flex flex-col items-center lg:ml-auto lg:w-1/2 lg:items-end">
          {/* Content card: frosted panel on mobile, dissolves to bare copy on lg+. */}
          <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[2rem] bg-white/75 px-6 py-9 text-center shadow-[0_16px_50px_rgb(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-xl lg:max-w-none lg:items-end lg:rounded-none lg:bg-transparent lg:p-0 lg:text-right lg:shadow-none lg:ring-0 lg:backdrop-blur-none">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-medal-500/30 bg-medal-50/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-medal-700 backdrop-blur-sm">
              Upcoming Event
            </span>

            <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-olympiad-900 sm:text-5xl lg:text-5xl xl:text-6xl">
              {config.title}
            </h1>

            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-sm font-medium text-olympiad-800 shadow-[0_2px_10px_rgb(0,0,0,0.04)] backdrop-blur-sm">
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-olympiad-500" aria-hidden="true">
                <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {config.eventDate}
            </div>

            <CountdownTimer targetDate={config.eventDateISO} className="justify-center lg:justify-end" />

            <p className="max-w-lg text-base text-olympiad-800/80 sm:text-lg">{config.description}</p>

            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-end sm:justify-center sm:gap-4 lg:justify-end">
              {isRegistered ? (
                <div className="flex flex-col gap-1 text-center">
                  <span className="text-xs font-medium text-emerald-600">Already Registered</span>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => config.eventId && router.push(`/events/${config.eventId}`)}
                  >
                    {config.enterButtonText}
                  </Button>
                </div>
              ) : (
                <Button variant="primary" size="lg" onClick={handleRegisterClick}>
                  {config.registerButtonText}
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={() => router.push(config.detailsHref)}>
                {config.detailsButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
