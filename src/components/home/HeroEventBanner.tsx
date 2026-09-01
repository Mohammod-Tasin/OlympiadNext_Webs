"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { useAuth } from "@/lib/auth/useAuth";
import { heroConfig, type HeroEventConfig } from "@/data/heroConfig";

interface HeroEventBannerProps {
  config?: HeroEventConfig;
}

/**
 * Immersive full-bleed hero: the event illustration fills the entire
 * section as a CSS background, and all copy sits in a right-hand column
 * over a left-to-right "clear image → frosted white" readability gradient.
 * On < lg the layout collapses to a centred stack with a bottom-weighted
 * white wash instead, so the text stays legible when it overlaps the
 * busier middle of the image.
 */
export function HeroEventBanner({ config = heroConfig }: HeroEventBannerProps) {
  const router = useRouter();
  const { status } = useAuth();

  // Logged-in users are presumably already registered - send them to the
  // guidelines instead of back through the registration form.
  function handleRegisterClick() {
    router.push(status === "authenticated" ? config.detailsHref : config.registerHref);
  }

  return (
    <section
      className="relative w-full min-h-[max(90vh,800px)] overflow-hidden"
      style={{
        backgroundImage: `url(${config.image})`,
        backgroundSize: "cover",
        // Bias toward the upper-left so the Newton's cradle sits higher on
        // screen and the top of the artwork is cropped.
        backgroundPosition: "left 35%",
      }}
    >
      {/* Readability wash. Mobile: bottom-heavy vertical fade. lg+: image
          stays clear on the left, text column sits on near-solid white. */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/80 to-white/40 lg:bg-gradient-to-r lg:from-transparent lg:via-white/40 lg:to-white/95"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex min-h-[max(90vh,800px)] max-w-7xl items-center justify-center px-4 py-20 sm:px-6 lg:justify-end">
        {/* Negative top margin lifts the block above dead-centre so it lines
            up horizontally with the Newton's cradle in the artwork. */}
        <div className="-mt-12 flex w-full flex-col items-center gap-6 text-center lg:-mt-20 lg:w-1/2 lg:items-end lg:text-right">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500 backdrop-blur-sm">
            Upcoming Event
          </span>

          <h1 className="max-w-xl text-4xl font-extrabold tracking-tight text-olympiad-900 sm:text-5xl lg:text-6xl">
            {config.title}
          </h1>

          <div className="inline-flex w-fit items-center justify-end gap-2 rounded-full border border-black/5 bg-white/90 px-4 py-2 text-sm font-medium text-olympiad-800 shadow-[0_2px_10px_rgb(0,0,0,0.04)] backdrop-blur-sm">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-olympiad-500" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {config.eventDate}
          </div>

          <CountdownTimer
            targetDate={config.eventDateISO}
            className="justify-center lg:justify-end"
          />

          <p className="max-w-lg text-lg text-olympiad-800/80">{config.description}</p>

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center sm:gap-4 lg:justify-end">
            <Button variant="primary" size="lg" onClick={handleRegisterClick}>
              {config.registerButtonText}
            </Button>
            <Button variant="outline" size="lg" onClick={() => router.push(config.detailsHref)}>
              {config.detailsButtonText}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
