"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";

const SIDEBAR_LINKS: Array<{ href: string; label: string; icon: ReactNode }> = [
  {
    href: "/dashboard",
    label: "Exam Registrations",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
        <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
        <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
        <rect x="13" y="13" width="7.5" height="7.5" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: "/dashboard/results",
    label: "Results",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
        <path d="M4.5 20.5v-6M11 20.5V7M17.5 20.5v-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 3.5v2M12 18.5v2M20.5 12h-2M5.5 12h-2M17.66 6.34l-1.42 1.42M7.76 16.24l-1.42 1.42M17.66 17.66l-1.42-1.42M7.76 7.76L6.34 6.34"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

/** Persistent /dashboard/* sidebar: a clickable profile block linking to
 * /profile, the section nav, and logout. Shared across all dashboard
 * routes via dashboard/layout.tsx. */
export function DashboardSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const displayName = user?.full_name || user?.email;

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <aside className="w-full shrink-0 md:w-64">
      <Card className="overflow-hidden">
        <Link
          href="/profile"
          className="flex items-center gap-3 border-b border-black/5 px-5 py-5 transition-colors hover:bg-black/5"
        >
          <Avatar name={displayName} size="md" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-olympiad-900">{displayName}</p>
            <p className="truncate text-xs text-text-muted">{user?.email}</p>
          </div>
        </Link>

        <nav className="flex flex-wrap gap-1 p-3 md:flex-col">
          {SIDEBAR_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-medal-500/10 text-medal-700" : "text-olympiad-800 hover:bg-black/5",
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-black/5 p-3">
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>
    </aside>
  );
}
