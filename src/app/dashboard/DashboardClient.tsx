"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import type { Registration } from "@/types/registration";

const REGISTRATION_BADGE: Record<Registration["status"], { label: string; className: string }> = {
  pending: { label: "Pending approval", className: "bg-amber-50 text-amber-700" },
  approved: { label: "Approved", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700" },
};

/** Fetches the caller's exam registrations once on mount. */
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
 * otherwise a "not yet issued" note for an approved registration) plus a
 * round-entry action whose label/behavior depends on review status —
 * "Enter Event" links out once approved, "Awaiting Approval" and
 * "Rejected" are inert status text for the other two states. */
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

  const entryAction =
    registration.status === "approved" ? (
      <Link
        href={`/events/${registration.event_id}`}
        className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
      >
        Enter Event
      </Link>
    ) : registration.status === "pending" ? (
      <span
        className="text-sm font-medium text-text-muted"
        title="Your payment is still under review by an admin."
      >
        Awaiting Approval
      </span>
    ) : (
      <span className="text-sm font-medium text-text-muted">Rejected</span>
    );

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-2">
      {admitCard}
      {entryAction}
    </div>
  );
}

/** Exam-registration payments the student has submitted, with their
 * manual-review status. This is the whole /dashboard page's content. */
function RegistrationsCard({
  registrations,
  failed,
}: {
  registrations: Registration[] | null;
  failed: boolean;
}) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
          Exam Registrations
        </h2>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {registrations === null ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : failed ? (
          <p className="text-sm text-text-muted">Couldn&apos;t load your exam registrations right now.</p>
        ) : registrations.length === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-sm text-text-muted">You haven&apos;t registered for an exam yet.</p>
            <Button variant="primary" size="sm" onClick={() => router.push("/register/payment")}>
              Register Now
            </Button>
          </div>
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

export function DashboardClient() {
  const { registrations, failed } = useMyRegistrations();
  return <RegistrationsCard registrations={registrations} failed={failed} />;
}
