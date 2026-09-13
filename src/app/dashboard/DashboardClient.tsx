"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import { getEventRounds } from "@/lib/api/roundsApi";
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

interface RegistrationHighlight {
  kind: "winner" | "qualified";
  /** Only ever set alongside kind: "winner". */
  rank?: number;
}

/** For each "approved" registration, fetches that event's rounds once and
 * reduces them to a single compact highlight — a winner decision (with
 * rank) anywhere takes priority, else "qualified" if the student has
 * advanced past any round, else nothing. This page only needs that one
 * headline status per registration, not the full round-by-round roadmap
 * (that's /dashboard/results), so the fetched rounds are discarded right
 * after — never stored in full. Pending/rejected registrations never
 * fetch, since they can't have round activity yet. */
function useRegistrationHighlights(registrations: Registration[] | null) {
  const [highlights, setHighlights] = useState<Record<string, RegistrationHighlight | null>>({});

  useEffect(() => {
    if (!registrations) return;
    let cancelled = false;

    registrations
      .filter((reg) => reg.status === "approved")
      .forEach((reg) => {
        getEventRounds(reg.event_id)
          .then((res) => {
            if (cancelled) return;
            const winner = res.rounds.find((r) => r.your_status === "winner");
            const highlight: RegistrationHighlight | null = winner
              ? { kind: "winner", rank: winner.rank }
              : res.rounds.some((r) => r.your_status === "qualified")
                ? { kind: "qualified" }
                : null;
            setHighlights((prev) => ({ ...prev, [reg.id]: highlight }));
          })
          .catch(() => {
            // Best-effort only — the card is still useful without this
            // badge, so a failure here just shows nothing extra rather
            // than an error.
          });
      });

    return () => {
      cancelled = true;
    };
  }, [registrations]);

  return highlights;
}

/** A registration's footer: admit-card status (download link once issued,
 * otherwise a "not yet issued" note for an approved registration) plus a
 * round-entry action whose label/behavior depends on review status —
 * "Enter Event" links out once approved, "Awaiting Approval" and
 * "Rejected" are inert status text for the other two states. */
function RegistrationFooter({
  registration,
  highlight,
}: {
  registration: Registration;
  highlight?: RegistrationHighlight | null;
}) {
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

  const highlightBadge =
    highlight?.kind === "winner" ? (
      <span className="inline-flex items-center gap-1 text-sm font-semibold text-medal-700">
        🏆 Winner{highlight.rank != null ? ` — Rank ${highlight.rank}` : ""}
      </span>
    ) : highlight?.kind === "qualified" ? (
      <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
        ✓ Qualified to next round
      </span>
    ) : null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-4 border-t border-gray-100 pt-2">
      {admitCard}
      {entryAction}
      {highlightBadge}
    </div>
  );
}

/** Exam-registration payments the student has submitted, with their
 * manual-review status. This is the whole /dashboard page's content. */
function RegistrationsCard({
  registrations,
  failed,
  highlights,
}: {
  registrations: Registration[] | null;
  failed: boolean;
  highlights: Record<string, RegistrationHighlight | null>;
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
                <RegistrationFooter registration={reg} highlight={highlights[reg.id]} />
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
  const highlights = useRegistrationHighlights(registrations);
  return <RegistrationsCard registrations={registrations} failed={failed} highlights={highlights} />;
}
