"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { levelLabel } from "@/lib/constants/academic";
import { cn } from "@/lib/utils/cn";
import type { VerificationStatus } from "@/types/auth";

const SIDEBAR_LINKS: Array<{ href: string; label: string; icon: ReactNode }> = [
  {
    href: "/dashboard",
    label: "Overview",
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
    href: "/dashboard/mock-tests",
    label: "Mock Tests",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" aria-hidden="true">
        <path d="M6.5 3.5h8L18.5 8v12.5a1 1 0 01-1 1h-11a1 1 0 01-1-1v-16a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14.5 3.5V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M8.5 12.5h7M8.5 15.5h7M8.5 18.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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

/** KYC status pill. Renders nothing until the account reaches `pending`
 * (an `unverified` user is redirected to onboarding before this view). */
function VerificationBadge({ status }: { status?: VerificationStatus }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verification Pending (অপেক্ষমান)
      </span>
    );
  }
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified (ভেরিফাইড)
      </span>
    );
  }
  return null;
}

function InfoRow({ label, value, verified }: { label: string; value?: string; verified?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-olympiad-800/50">{label}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-olympiad-900">{value || "—"}</p>
      </div>
      {verified !== undefined && (
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
            verified ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600",
          )}
        >
          {verified ? "Verified" : "Unverified"}
        </span>
      )}
    </div>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const displayName = user?.full_name || user?.email;

  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:gap-8 md:p-8">
        <aside className="w-full shrink-0 md:w-64">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-5">
              <Avatar name={displayName} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-olympiad-900">{displayName}</p>
                <p className="truncate text-xs text-olympiad-800/60">{user?.email}</p>
              </div>
            </div>

            <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col md:overflow-visible">
              {SIDEBAR_LINKS.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex shrink-0 items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active ? "bg-olympiad-500/10 text-olympiad-500" : "text-olympiad-800 hover:bg-black/5",
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

        <main className="flex-1">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
            Student Dashboard
          </span>
          <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Welcome back, {displayName}</h1>
          <p className="mt-1 text-sm text-olympiad-800/70">Here&apos;s what&apos;s happening with your account.</p>

          {(user?.verification_status === "pending" || user?.verification_status === "verified") && (
            <div className="mt-4">
              <VerificationBadge status={user.verification_status} />
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Profile Status</h2>
                <Link href="/profile" className="text-xs font-medium text-olympiad-500 hover:text-olympiad-800">
                  View profile
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <InfoRow label="Email" value={user?.email} verified={user?.is_email_verified} />
                <InfoRow label="Institution" value={user?.institution_name} />
                <InfoRow label="Level" value={levelLabel(user?.level)} />
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Upcoming Event</h2>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-olympiad-500/10 text-olympiad-500">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                    <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-olympiad-900">Mock Test</p>
                  <p className="mt-0.5 text-sm text-olympiad-800/70">Apr 5, 2026 &middot; 10:00 AM</p>
                </div>
                <Link
                  href="/guidelines"
                  className="mt-auto text-xs font-medium text-olympiad-500 hover:text-olympiad-800"
                >
                  View all events
                </Link>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Quick Actions</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row">
                <Button variant="primary" size="sm" className="flex-1">
                  Download Admit Card
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => router.push("/profile")}>
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => router.push("/guidelines")}>
                  View Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
