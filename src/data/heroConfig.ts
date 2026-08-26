export interface HeroEventConfig {
  /** Name of the featured olympiad/exam, e.g. "National Physics Olympiad 2026". */
  subjectTitle: string;
  /** Pre-formatted date/time to display, e.g. "September 15, 2026 • 10:00 AM". */
  eventDate: string;
  /** Short tagline shown under the title. */
  description: string;
  /** Path (local under /public, or a full URL) to the hero illustration. */
  imagePath: string;
  /** Alt text for the hero illustration. */
  imageAlt: string;
  registerButtonText: string;
  detailsButtonText: string;
  /** Where the primary/secondary buttons route to. */
  registerHref: string;
  detailsHref: string;
}

// Single source of truth for the homepage's featured-event banner. Update
// this file to change the event's copy, date, image, or button links —
// no UI code needs to change.
export const heroConfig: HeroEventConfig = {
  subjectTitle: "National Math Olympiad 2026",
  eventDate: "September 15, 2026 • 10:00 AM",
  description:
    "Compete with the brightest young physicists in the country. Register your school and take on challenging, curriculum-aligned problems designed to sharpen real olympiad instincts.",
  imagePath: "assets\math.svg",
  imageAlt: "Illustration of a student preparing for the National Physics Olympiad",
  registerButtonText: "Register Now",
  detailsButtonText: "See Details",
  registerHref: "/register",
  detailsHref: "/guidelines",
};
