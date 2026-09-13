/** The "About" dropdown's sub-links, shared by Navbar.tsx (as a dropdown)
 * and Footer.tsx (listed flat) so the two stay in sync. */
export const ABOUT_LINKS: Array<{ href: string; label: string }> = [
  { href: "/about", label: "About Us" },
  { href: "/privacy", label: "Privacy & Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];
