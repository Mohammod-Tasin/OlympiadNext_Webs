"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { ApiError } from "@/lib/api/client";
import { getEventRounds, getEventById, enterRound } from "@/lib/api/roundsApi";
import type { EventRound, EventRoundsResponse } from "@/types/event";

const DEFAULT_TITLE = "Event Rounds";

const REASON_TEXT: Record<string, string> = {
  "round is not ongoing": "This round hasn't started yet.",
  "no active registration for this event": "You don't have an active registration for this event.",
  "not qualified from the previous round": "You didn't qualify from the previous round.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 017 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RoundCard({
  round,
  eventId,
  entering,
  enterError,
  onEnter,
}: {
  round: EventRound;
  eventId: string;
  entering: boolean;
  enterError?: string;
  onEnter: (round: EventRound) => void;
}) {
  const isDisabledState = round.your_status === "eliminated";

  return (
    <Card className={isDisabledState ? "opacity-60" : undefined}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-olympiad-900">{round.round_name}</h3>
          <p className="text-sm text-text-muted">{formatDate(round.start_at)}</p>
        </div>
        {round.your_status === "winner" && (
          <span className="inline-flex items-center gap-2 rounded-full bg-medal-500/10 px-3 py-1.5 text-sm font-semibold text-medal-700 ring-1 ring-inset ring-medal-500/30">
            🏆 Winner
          </span>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {round.your_status === "waiting" && (
          <p className="text-sm text-text-muted">Waiting for previous round results</p>
        )}

        {round.your_status === "locked" && (
          <>
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <LockIcon />
              {round.duration_minutes} min
            </p>
            <CountdownTimer targetDate={round.start_at} />
          </>
        )}

        {round.your_status === "ready" && (
          <>
            <p className="text-sm text-text-muted">{round.duration_minutes} min</p>
            <Button onClick={() => onEnter(round)} loading={entering} className="w-fit">
              Enter Exam
            </Button>
            {enterError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {enterError}
              </p>
            )}
          </>
        )}

        {round.your_status === "eliminated" && (
          <p className="text-sm text-text-muted">Not qualified for this round.</p>
        )}

        {round.your_status === "qualified" && (
          <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
            <CheckIcon />
            Qualified — advanced to next round
          </p>
        )}

        {round.your_status === "winner" && (
          <p className="text-sm font-medium text-medal-700">Congratulations — you won this event!</p>
        )}

        {round.your_status === null && (
          <p className="text-sm text-text-muted">Status unavailable.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function EventRoundsContent({ eventId }: { eventId: string }) {
  const router = useRouter();
  const [data, setData] = useState<EventRoundsResponse | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [enterErrors, setEnterErrors] = useState<Record<string, string>>({});

  async function load() {
    setLoading(true);
    setLoadError(null);
    try {
      setData(await getEventRounds(eventId));
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Something went wrong loading this event. Please try again.");
      setLoading(false);
      return;
    }
    setLoading(false);

    try {
      const event = await getEventById(eventId);
      if (event) setTitle(event.title);
    } catch {
      // Best-effort only — keep the generic heading on failure.
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function handleEnter(round: EventRound) {
    setEnteringId(round.id);
    setEnterErrors((prev) => ({ ...prev, [round.id]: "" }));
    try {
      await enterRound(round.id);
      router.push(`/events/${eventId}/rounds/${round.id}/exam`);
    } catch (err) {
      const message = err instanceof ApiError ? (REASON_TEXT[err.message] ?? err.message) : "Something went wrong. Please try again.";
      setEnterErrors((prev) => ({ ...prev, [round.id]: message }));
    } finally {
      setEnteringId(null);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {loading ? (
        <p className="text-sm text-text-muted">Loading…</p>
      ) : loadError ? (
        <Card>
          <CardContent className="flex flex-col items-start gap-3">
            <p className="text-sm text-red-600">{loadError}</p>
            <Button size="sm" variant="outline" onClick={() => void load()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : !data ? null : (
        <>
          <h1 className="text-2xl font-bold text-olympiad-900 sm:text-3xl">{title}</h1>

          {data.rounds[0]?.your_status === "not_eligible" ? (
            <Card className="mt-8">
              <CardContent className="flex flex-col gap-3">
                <p className="text-sm text-text-muted">
                  You don&apos;t have an approved registration for this event yet, so round details
                  aren&apos;t available. If you&apos;ve already registered, it may still be pending
                  verification — check your registration status for updates.
                </p>
                <div className="flex flex-wrap gap-4 text-sm font-medium">
                  <Link href="/register/payment" className="text-olympiad-500 hover:text-olympiad-800">
                    Check registration status
                  </Link>
                  <Link href="/profile" className="text-olympiad-500 hover:text-olympiad-800">
                    View profile
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="mt-8 flex flex-col gap-4">
              {[...data.rounds]
                .sort((a, b) => a.round_order - b.round_order)
                .map((round) => (
                  <RoundCard
                    key={round.id}
                    round={round}
                    eventId={eventId}
                    entering={enteringId === round.id}
                    enterError={enterErrors[round.id] || undefined}
                    onEnter={handleEnter}
                  />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
