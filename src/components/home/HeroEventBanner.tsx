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
 * Full-bleed hero. The event illustration is a CSS background anchored to
 * its left-centre, so the Newton's cradle (which lives in the left third of
 * the 16:9 artwork) stays framed and vertically centred at every viewport
 * aspect ratio — a `center`/`bottom` anchor cropped it away on portrait
 * screens.
 *
 * - lg+: cradle clear on the left; copy occupies the right 50% over a
 *   left→right "transparent → white" readability gradient.
 * - < lg: the copy collapses to a centred frosted card so it stays legible
 *   wherever it overlaps the image.
 */
export function HeroEventBanner({ config = heroConfig }: HeroEventBannerProps) {
  const router = useRouter();
  const { status } = useAuth();

  // Logged-in users are presumably already registered — send them to the
  // guidelines instead of back through the registration form.
  function handleRegisterClick() {
    router.push(status === "authenticated" ? config.detailsHref : config.registerHref);
  }

  return (
    <section
      className="relative flex min-h-[calc(100vh-4rem)] w-full overflow-hidden"
      style={{
        backgroundImage: `url(${config.image})`,
        backgroundSize: "cover",
        backgroundPosition: "10% 50%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Desktop-only readability gradient. The whole left half is fully
          transparent (via-white/0 sits at 50%), so the Newton's cradle keeps
          100% of the source image's clarity; only the right half ramps up to
          near-solid white behind the text column. `white/0` rather than
          `transparent` avoids CSS's transparent-black fade tinting the ramp.
          On < lg there is no wash at all — the frosted content card carries
          the text contrast on its own. */}
      <div
        className="absolute inset-0 hidden bg-gradient-to-r from-white/0 via-white/0 to-white/95 lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-center px-6 py-16 lg:px-8">
        {/* Positioning wrapper: dead-centre vertically, right half on lg+. */}
        <div className="flex flex-col items-center lg:ml-auto lg:w-1/2 lg:items-end">
          {/* Content card: frosted panel on mobile, dissolves to bare copy on lg+. */}
          <div className="flex w-full max-w-xl flex-col items-center gap-6 rounded-[2rem] bg-white/75 px-6 py-9 text-center shadow-[0_16px_50px_rgb(15,23,42,0.12)] ring-1 ring-white/60 backdrop-blur-xl lg:max-w-none lg:items-end lg:rounded-none lg:bg-transparent lg:p-0 lg:text-right lg:shadow-none lg:ring-0 lg:backdrop-blur-none">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500 backdrop-blur-sm">
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

            <div className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:justify-center sm:gap-4 lg:justify-end">
              <Button variant="primary" size="lg" onClick={handleRegisterClick}>
                {config.registerButtonText}
              </Button>
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
