import Link from "next/link";

interface BrandLogoProps {
  /** Extra classes for the outer link wrapper. */
  className?: string;
  /** Accessible label for the logo link. */
  label?: string;
}

/**
 * Shikhor brand lockup: the mountain/pen icon set next to the wordmark,
 * matching the horizontal orientation of the official logo reference.
 *
 * Both assets live in `public/` as PNGs trimmed tight to the artwork (the
 * originals carried ~12-19% transparent padding, which made the mark read
 * small in the 4rem navbar). They are aligned with a flex row and a small
 * positive gap; the icon box runs a little larger than the wordmark's so
 * the glyph reads a touch taller than the word, matching the reference.
 *
 * The link gets a subtle scale/opacity hover for a premium feel; sizing
 * can be tuned per placement via the `className` prop.
 */
export function BrandLogo({ className = "", label = "Shikhor home" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={`flex origin-left items-center gap-2 transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:opacity-95 ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-transparent.png"
        alt=""
        aria-hidden="true"
        className="h-12 w-auto object-contain md:h-14"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logotext.png"
        alt="Shikhor"
        className="h-9 w-auto object-contain md:h-11"
      />
    </Link>
  );
}
