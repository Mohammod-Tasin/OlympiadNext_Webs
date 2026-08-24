"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/useAuth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/guidelines", label: "Guidelines" },
];

export function Navbar() {
  const { status, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";

  async function handleLogout() {
    setIsMenuOpen(false);
    await logout();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-olympiad-50 bg-white">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold text-olympiad-900">
          OlympiadNext
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-olympiad-800 transition-colors hover:text-olympiad-500"
              >
                Dashboard
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push("/login")}>
                Login
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push("/register")}>
                Register
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
        <div className="border-t border-olympiad-50 bg-white px-4 pb-4 md:hidden">
          <div className="flex flex-col gap-3 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-olympiad-800"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-olympiad-800"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
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
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
