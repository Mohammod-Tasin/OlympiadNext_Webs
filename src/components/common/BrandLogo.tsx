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
 * Both assets live in `public/` as high-res PNGs and are aligned with a
 * flex row. Each PNG bakes in transparent padding (~19% on the icon's
 * right edge, ~15% on the wordmark's left edge), so a small negative
 * margin pulls the wordmark back in to reproduce the tight gap in the
 * reference lockup. The icon box runs larger than the wordmark's so the
 * glyph reads a touch taller than the word, again matching the reference.
 *
 * The link gets a subtle scale/opacity hover for a premium feel; sizing
 * can be tuned per placement via the `className` prop.
 */
export function BrandLogo({ className = "", label = "Shikhor home" }: BrandLogoProps) {
  return (
    <Link
      href="/"
      aria-label={label}
      className={`flex origin-left items-center transition-transform duration-300 ease-in-out hover:scale-[1.03] hover:opacity-95 ${className}`.trim()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-transparent.png"
        alt=""
        aria-hidden="true"
        className="h-11 w-auto object-contain md:h-14"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logotext.png"
        alt="Shikhor"
        className="-ml-3 h-8 w-auto object-contain md:-ml-5 md:h-10"
      />
    </Link>
  );
}
