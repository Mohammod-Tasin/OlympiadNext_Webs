"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { BrandLogo } from "@/components/common/BrandLogo";
import { NavDropdown } from "@/components/layout/NavDropdown";
import { useAuth } from "@/lib/auth/useAuth";
import { ABOUT_LINKS } from "@/data/navLinks";

/** Links before the (conditional) Dashboard entry. */
const MAIN_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/champions", label: "Champions" },
];

/** Links after the (conditional) Dashboard entry, before the About dropdown. */
const TRAILING_LINKS = [{ href: "/rules", label: "Guidelines" }];

export function Navbar() {
  const { status, user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const displayName = user?.full_name || user?.email;

  async function handleLogout() {
    setIsMenuOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo />

        <div className="hidden items-center gap-6 md:flex">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
            >
              Dashboard
            </Link>
          )}

          {TRAILING_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
            >
              {link.label}
            </Link>
          ))}

          <NavDropdown label="About" links={ABOUT_LINKS} />

          {isAuthenticated ? (
            <Link
              href="/profile"
              aria-label={`View profile${displayName ? ` for ${displayName}` : ""}`}
              className="transition-opacity hover:opacity-80"
            >
              <Avatar name={displayName} size="sm" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push("/register")}>
                Sign Up
              </Button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-olympiad-900 md:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-black/5 bg-white/80 px-4 pb-4 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-olympiad-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                href="/dashboard"
                className="text-sm font-medium text-olympiad-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {TRAILING_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-olympiad-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* No nested dropdown on mobile — the same three links stacked
                under a plain heading, matching Footer.tsx's flat listing. */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">About</span>
              {ABOUT_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="pl-2 text-sm font-medium text-olympiad-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Avatar name={displayName} size="sm" />
                  <span className="text-sm font-medium text-olympiad-800">{displayName}</span>
                </Link>
                <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setIsMenuOpen(false);
                    router.push("/register");
                  }}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
