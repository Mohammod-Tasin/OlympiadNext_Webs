"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import type { Registration } from "@/types/registration";
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
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-medal-500" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Verified (ভেরিফাইড)
      </span>
    );
  }
  return null;
}

const REGISTRATION_BADGE: Record<Registration["status"], { label: string; className: string }> = {
  pending: { label: "Pending approval", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700" },
};

/** Fetches the caller's exam registrations once on mount. Shared by the
 * registrations list and the "Download Admit Card" quick action. */
function useMyRegistrations() {
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getMyRegistrations()
      .then((rows) => {
        if (!cancelled) setRegistrations(rows);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { registrations, failed };
}

/** A registration's footer: admit-card status (download link once issued,
 * otherwise a "not yet issued" note for an approved registration, nothing
 * for a pending one) plus a link into that event's rounds — hidden only
 * for a rejected registration, which has no path forward. */
function RegistrationFooter({ registration }: { registration: Registration }) {
  const admitCard = registration.admit_card_url ? (
    <a
      href={registration.admit_card_url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
        <path d="M12 3.5v11m0 0 3.5-3.5M12 14.5 8.5 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4.5 15.5v3a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      Download admit card
    </a>
  ) : registration.status === "approved" ? (
    <span className="text-xs text-text-muted">Admit card: not yet issued</span>
  ) : null;

  const showViewRounds = registration.status !== "rejected";
  if (!admitCard && !showViewRounds) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-2">
      {admitCard}
      {showViewRounds && (
        <Link
          href={`/events/${registration.event_id}`}
          className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
        >
          View event rounds
        </Link>
      )}
    </div>
  );
}

/** Exam-registration payments the student has submitted, with their
 * manual-review status. Renders nothing until at least one exists. */
function RegistrationsCard({
  registrations,
  failed,
}: {
  registrations: Registration[] | null;
  failed: boolean;
}) {
  if (failed || (registrations && registrations.length === 0)) return null;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
          Exam Registrations
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {registrations === null ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : (
          registrations.map((reg) => {
            const badge = REGISTRATION_BADGE[reg.status];
            return (
              <div
                key={reg.id}
                className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-olympiad-900">
                      {reg.event_title || "Exam registration"}
                    </p>
                    <p className="text-xs text-text-muted">
                      {reg.payment_method.toUpperCase()} · TrxID {reg.transaction_id}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                      badge.className,
                    )}
                  >
                    {badge.label}
                  </span>
                </div>
                <RegistrationFooter registration={reg} />
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}

/** Prominent entry point into exam rounds for an approved registration, and
 * an explanatory state otherwise (loading / load-failed / pending-only /
 * no registrations at all) — replaces the old hardcoded "Upcoming Event"
 * placeholder with something actually driven by the caller's data. */
function ExamRoundsCard({
  registrations,
  failed,
}: {
  registrations: Registration[] | null;
  failed: boolean;
}) {
  const router = useRouter();

  let content: ReactNode;
  if (registrations === null) {
    content = <p className="text-sm text-text-muted">Loading…</p>;
  } else if (failed) {
    content = <p className="text-sm text-text-muted">Couldn&apos;t load your exam rounds right now.</p>;
  } else {
    const approved = registrations.filter((reg) => reg.status === "approved");
    if (approved.length > 0) {
      content = (
        <div className="flex flex-wrap gap-3">
          {approved.map((reg) => (
            <Link
              key={reg.id}
              href={`/events/${reg.event_id}`}
              className="flex flex-1 min-w-[220px] items-center rounded-xl border border-medal-500/30 bg-medal-50 px-5 py-4 text-sm font-semibold text-medal-700 transition-colors hover:bg-medal-100"
            >
              Enter {reg.event_title || "Exam"} Rounds
            </Link>
          ))}
        </div>
      );
    } else if (registrations.some((reg) => reg.status !== "rejected")) {
      content = (
        <p className="text-sm text-text-muted">
          Your registration is awaiting admin approval — you&apos;ll be able to enter exam rounds once
          it&apos;s approved.
        </p>
      );
    } else {
      content = (
        <div className="flex flex-col items-start gap-3">
          <p className="text-sm text-text-muted">You haven&apos;t registered for an exam yet.</p>
          <Button variant="primary" size="sm" onClick={() => router.push("/register/payment")}>
            Register Now
          </Button>
        </div>
      );
    }
  }

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Exam Rounds</h2>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { registrations, failed } = useMyRegistrations();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const displayName = user?.full_name || user?.email;
  // The most recent registration that has an admit card ready to download.
  const admitCardUrl = registrations?.find((reg) => reg.admit_card_url)?.admit_card_url ?? null;

  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:gap-8 md:p-8">
        <aside className="w-full shrink-0 md:w-64">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-3 border-b border-black/5 px-5 py-5">
              <Avatar name={displayName} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-olympiad-900">{displayName}</p>
                <p className="truncate text-xs text-text-muted">{user?.email}</p>
              </div>
            </div>

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

        <main className="flex-1">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-medal-500/30 bg-medal-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-medal-700">
            Student Dashboard
          </span>
          <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Welcome back, {displayName}</h1>
          <p className="mt-1 text-sm text-text-muted">Here&apos;s what&apos;s happening with your account.</p>

          {(user?.verification_status === "pending" || user?.verification_status === "verified") && (
            <div className="mt-4">
              <VerificationBadge status={user.verification_status} />
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-3">
              <CardHeader className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Profile Status</h2>
                <Link href="/profile" className="text-xs font-medium text-olympiad-500 hover:text-olympiad-800">
                  View profile
                </Link>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-muted">
                  Your institution, level, and email verification are on file — visit your profile to review
                  or update them.
                </p>
              </CardContent>
            </Card>

            <ExamRoundsCard registrations={registrations} failed={failed} />

            <RegistrationsCard registrations={registrations} failed={failed} />

            <Card className="lg:col-span-3">
              <CardHeader>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Quick Actions</h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 lg:flex-row">
                {admitCardUrl ? (
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => window.open(admitCardUrl, "_blank", "noopener,noreferrer")}
                  >
                    Download Admit Card
                  </Button>
                ) : (
                  <p className="flex flex-1 items-center justify-center rounded-full px-4 py-2 text-center text-sm text-text-muted">
                    Admit card not yet issued
                  </p>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => router.push("/profile?edit=1")}
                >
                  Edit Profile
                </Button>
                <Button variant="ghost" size="sm" className="flex-1" onClick={() => router.push("/rules")}>
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

export function DashboardClient() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
