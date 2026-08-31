export interface HeroEventConfig {
  /** Name of the featured olympiad/exam, e.g. "National Physics Olympiad 2026". */
  title: string;
  /** Pre-formatted date/time to display, e.g. "Sep 15, 2026 • 10:00 AM". */
  eventDate: string;
  /** The same date/time as `eventDate`, as an ISO 8601 string with an explicit
   * offset, so the countdown timer computes against an unambiguous instant. */
  eventDateISO: string;
  /** Short tagline shown under the title. */
  description: string;
  /** Path (local under /public, or a full URL) to the hero illustration. */
  image: string;
  /** Alt text for the hero illustration. */
  imageAlt: string;
  registerButtonText: string;
  detailsButtonText: string;
  /** Where the primary/secondary buttons route to. */
  registerHref: string;
  detailsHref: string;
}

// Fallback used when the backend has no active event (or the request fails).
// The homepage prefers live data from `GET /api/client/events`; this object
// only fills the copy, date, image, and button links that the API does not
// provide (button text/hrefs), and stands in wholesale when there is no event.
export const heroConfig: HeroEventConfig = {
  title: "National Math Olympiad 2026",
  eventDate: "Sep 15, 2026 • 10:00 AM",
  eventDateISO: "2026-09-15T10:00:00+06:00",
  description:
    "Compete with the brightest young mathematicians in the country. Register your school and take on challenging, curriculum-aligned problems designed to sharpen real olympiad instincts.",
  image: "/assets/math.svg",
  imageAlt: "Illustration of a student preparing for the National Math Olympiad",
  registerButtonText: "Register Now",
  detailsButtonText: "See Details",
  registerHref: "/register",
  detailsHref: "/guidelines",
};
