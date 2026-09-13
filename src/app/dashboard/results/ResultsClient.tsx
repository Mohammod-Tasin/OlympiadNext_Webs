"use client";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils/cn";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import { getEventRounds } from "@/lib/api/roundsApi";
import { getEventPrizes } from "@/lib/api/prizesApi";
import { findPrize } from "@/lib/utils/findPrize";
import type { Registration } from "@/types/registration";
import type { EventRound, RoundStatus } from "@/types/event";
import type { PrizeResponse } from "@/types/prize";

interface EventResult {
  registration: Registration;
  /** null = still loading (or not yet requested). */
  rounds: EventRound[] | null;
  failed: boolean;
  /** null until (and unless) this event's rounds come back with at least
   * one "winner" — prizes are fetched per-event, not globally, and only
   * when actually needed. */
  prizes: PrizeResponse[] | null;
}

/** Fetches the caller's registrations once, then fans out one
 * getEventRounds call per registration. Each event's rounds load and fail
 * independently — a slow or broken event must not block the others. */
function useResults() {
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);
  const [registrationsFailed, setRegistrationsFailed] = useState(false);
  const [results, setResults] = useState<EventResult[]>([]);

  useEffect(() => {
    let cancelled = false;

    getMyRegistrations()
      .then((rows) => {
        if (cancelled) return;
        setRegistrations(rows);
        setResults(rows.map((registration) => ({ registration, rounds: null, failed: false, prizes: null })));

        rows.forEach((registration) => {
          getEventRounds(registration.event_id)
            .then((res) => {
              if (cancelled) return;
              setResults((prev) =>
                prev.map((item) =>
                  item.registration.id === registration.id ? { ...item, rounds: res.rounds } : item,
                ),
              );

              // Scoped to this event only — a student's other registered
              // events never trigger a prize fetch just because this one
              // did, and this one only fetches if it actually has a winner.
              if (res.rounds.some((r) => r.your_status === "winner")) {
                void getEventPrizes(registration.event_id).then((prizes) => {
                  if (cancelled) return;
                  setResults((prev) =>
                    prev.map((item) => (item.registration.id === registration.id ? { ...item, prizes } : item)),
                  );
                });
              }
            })
            .catch(() => {
              if (cancelled) return;
              setResults((prev) =>
                prev.map((item) =>
                  item.registration.id === registration.id ? { ...item, failed: true } : item,
                ),
              );
            });
        });
      })
      .catch(() => {
        if (!cancelled) setRegistrationsFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { registrations, registrationsFailed, results };
}

type StepVisualState = "qualified" | "winner" | "progress" | "eliminated" | "neutral";

/** Collapses the backend's seven your_status values down to the five
 * visual states this roadmap distinguishes: waiting/locked/ready all read
 * as one "in progress" amber step, and an unexpected not_eligible/null
 * (these are the student's own registered events, so it shouldn't occur)
 * falls back to a neutral gray step instead of breaking the page. */
function stepState(status: RoundStatus | null): StepVisualState {
  switch (status) {
    case "winner":
      return "winner";
    case "qualified":
      return "qualified";
    case "waiting":
    case "locked":
    case "ready":
      return "progress";
    case "eliminated":
      return "eliminated";
    default:
      return "neutral";
  }
}

const STEP_CLASSES: Record<StepVisualState, string> = {
  qualified: "bg-emerald-500 text-white",
  winner: "bg-emerald-500 text-white",
  progress: "bg-amber-500 text-white",
  eliminated: "bg-red-500 text-white",
  neutral: "bg-gray-300 text-gray-700",
};

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function StepCircle({
  state,
  roundOrder,
  className,
}: {
  state: StepVisualState;
  roundOrder: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full text-sm font-bold",
        STEP_CLASSES[state],
        className,
      )}
    >
      {state === "qualified" || state === "winner" ? (
        <CheckIcon />
      ) : state === "eliminated" ? (
        <XIcon />
      ) : (
        roundOrder
      )}
    </span>
  );
}

function WinnerBadge({ rank }: { rank?: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-medal-500/15 px-2 py-0.5 text-xs font-semibold text-medal-700">
      {rank != null ? `Winner — Rank ${rank}` : "Winner"}
    </span>
  );
}

/** The connected-path roadmap for one event's rounds, mirroring
 * HowToParticipate.tsx's mobile-vertical / desktop-horizontal pattern:
 * a dotted line on mobile, a line-connected row on desktop. */
function RoundRoadmap({ rounds, prizes }: { rounds: EventRound[]; prizes: PrizeResponse[] | null }) {
  if (rounds.length === 0) {
    return <p className="text-sm text-text-muted">No rounds have been configured for this event yet.</p>;
  }

  return (
    <>
      <ol className="flex flex-col gap-6 border-l-2 border-olympiad-300 pl-8 sm:hidden">
        {rounds.map((round) => {
          const state = stepState(round.your_status);
          const prize = state === "winner" ? findPrize(prizes, round.rank) : undefined;
          return (
            <li key={round.id} className="relative">
              <StepCircle state={state} roundOrder={round.round_order} className="absolute -left-[48px] top-0 h-8 w-8" />
              <p className="text-sm font-medium text-olympiad-900">{round.round_name}</p>
              {state === "winner" && (
                <div className="mt-1 flex flex-col items-start gap-0.5">
                  <WinnerBadge rank={round.rank} />
                  {prize && <span className="text-xs font-medium text-medal-700">{prize.prize_name}</span>}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <ol className="hidden sm:flex sm:items-start">
        {rounds.map((round, i) => {
          const state = stepState(round.your_status);
          const prize = state === "winner" ? findPrize(prizes, round.rank) : undefined;
          return (
            <Fragment key={round.id}>
              <li className="flex flex-1 flex-col items-center gap-2 px-2 text-center">
                <StepCircle state={state} roundOrder={round.round_order} className="h-10 w-10" />
                <p className="text-sm font-medium text-olympiad-900">{round.round_name}</p>
                {state === "winner" && (
                  <>
                    <WinnerBadge rank={round.rank} />
                    {prize && <span className="text-xs font-medium text-medal-700">{prize.prize_name}</span>}
                  </>
                )}
              </li>
              {i < rounds.length - 1 && (
                <div className="mt-5 h-0.5 flex-1 self-start bg-olympiad-300" aria-hidden="true" />
              )}
            </Fragment>
          );
        })}
      </ol>
    </>
  );
}

function EventRoadmapCard({ result }: { result: EventResult }) {
  const { registration, rounds, failed, prizes } = result;

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
          {registration.event_title || "Exam"}
        </h2>
      </CardHeader>
      <CardContent>
        {failed ? (
          <p className="text-sm text-red-600">Couldn&apos;t load results for this event right now.</p>
        ) : rounds === null ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : (
          <RoundRoadmap rounds={rounds} prizes={prizes} />
        )}
      </CardContent>
    </Card>
  );
}

export function ResultsClient() {
  const router = useRouter();
  const { registrations, registrationsFailed, results } = useResults();

  if (registrations === null) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-text-muted">Loading…</p>
        </CardContent>
      </Card>
    );
  }

  if (registrationsFailed) {
    return (
      <Card>
        <CardContent>
          <p className="text-sm text-text-muted">Couldn&apos;t load your results right now.</p>
        </CardContent>
      </Card>
    );
  }

  if (registrations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Results</h2>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-3">
          <p className="text-sm text-text-muted">
            You haven&apos;t registered for an exam yet — register to see your round-by-round results here.
          </p>
          <Button variant="primary" size="sm" onClick={() => router.push("/register/payment")}>
            Register Now
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {results.map((result) => (
        <EventRoadmapCard key={result.registration.id} result={result} />
      ))}
    </div>
  );
}
