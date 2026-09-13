"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CountdownTimer } from "@/components/home/CountdownTimer";
import { ApiError } from "@/lib/api/client";
import { getEventRounds, getEventById, enterRound, getMyRegistrationStatus } from "@/lib/api/roundsApi";
import { getEventPrizes } from "@/lib/api/prizesApi";
import { findPrize } from "@/lib/utils/findPrize";
import { useAuth } from "@/lib/auth/useAuth";
import { levelLabel } from "@/lib/constants/academic";
import type { EventRound, EventRoundsResponse } from "@/types/event";
import type { PrizeResponse } from "@/types/prize";
import type { MyRegistrationStatus } from "@/types/registration";
import type { User } from "@/types/auth";

const DEFAULT_TITLE = "Event Rounds";

const REASON_TEXT: Record<string, string> = {
  "round is not ongoing": "This round hasn't started yet.",
  "no active registration for this event": "You don't have an active registration for this event.",
  "not qualified from the previous round": "You didn't qualify from the previous round.",
};

interface NotEligibleReason {
  en: string;
  bn: string;
  linkHref: string;
  linkEn: string;
  linkBn: string;
}

// Priority order matches the backend's own eligibility checks (level, then
// identity verification, then registration): level mismatch is checked
// first since nothing else matters if the round isn't even open to this
// student's level, then verification (a separate concern from payment
// approval), and only once both pass does registrationStatus (fetched
// separately, see the effect below) get consulted. Returns null only
// while that fetch is still in flight — every other branch is
// synchronous, sourced from `user` (already loaded via useAuth()).
function resolveNotEligibleReason(
  roundLevel: string | undefined,
  user: User | null,
  registrationStatus: MyRegistrationStatus | null,
): NotEligibleReason | null {
  if (roundLevel && user?.level && user.level !== roundLevel) {
    return {
      en: `This round is only open to ${levelLabel(roundLevel)} students.`,
      bn: `এই রাউন্ডটি শুধুমাত্র ${levelLabel(roundLevel)} শিক্ষার্থীদের জন্য উন্মুক্ত।`,
      linkHref: "/profile",
      linkEn: "View profile",
      linkBn: "প্রোফাইল দেখুন",
    };
  }

  if (user?.verification_status !== "verified") {
    if (user?.verification_status === "pending") {
      return {
        en: "Your identity verification is pending review.",
        bn: "আপনার পরিচয় যাচাইকরণ পর্যালোচনাধীন রয়েছে।",
        linkHref: "/profile",
        linkEn: "View profile",
        linkBn: "প্রোফাইল দেখুন",
      };
    }
    if (user?.verification_status === "rejected") {
      return {
        en: "Your identity verification was rejected.",
        bn: "আপনার পরিচয় যাচাইকরণ প্রত্যাখ্যান করা হয়েছে।",
        linkHref: "/profile",
        linkEn: "Update your documents",
        linkBn: "ডকুমেন্ট আপডেট করুন",
      };
    }
    return {
      en: "You haven't submitted your identity verification yet.",
      bn: "আপনি এখনও আপনার পরিচয় যাচাইকরণ জমা দেননি।",
      linkHref: "/profile",
      linkEn: "Complete verification",
      linkBn: "যাচাইকরণ সম্পন্ন করুন",
    };
  }

  if (registrationStatus === "none") {
    return {
      en: "You haven't registered for this event yet.",
      bn: "আপনি এখনও এই ইভেন্টের জন্য নিবন্ধন করেননি।",
      linkHref: "/register/terms",
      linkEn: "Register now",
      linkBn: "এখনই নিবন্ধন করুন",
    };
  }
  if (registrationStatus === "pending") {
    return {
      en: "Your registration is awaiting payment approval.",
      bn: "আপনার নিবন্ধন পেমেন্ট অনুমোদনের অপেক্ষায় রয়েছে।",
      linkHref: "/register/payment",
      linkEn: "Check registration status",
      linkBn: "নিবন্ধনের অবস্থা দেখুন",
    };
  }
  if (registrationStatus === "rejected") {
    return {
      en: "Your registration was rejected.",
      bn: "আপনার নিবন্ধন প্রত্যাখ্যান করা হয়েছে।",
      linkHref: "/register/payment",
      linkEn: "View details",
      linkBn: "বিস্তারিত দেখুন",
    };
  }

  // registrationStatus is still loading (null) — caller shows a loading row.
  return null;
}

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

// Mirrors the admin panel's own LevelBadge color scheme for visual
// consistency across the platform. Only shown here in the edge case where
// an authenticated student has no level on file yet, in which case the
// backend returns every level's rounds unfiltered — this badge is what
// keeps that mix unambiguous per round.
const LEVEL_BADGE_COLORS: Record<string, string> = {
  Junior: "bg-sky-100 text-sky-700",
  Secondary: "bg-violet-100 text-violet-700",
  "Higher Secondary": "bg-rose-100 text-rose-700",
};

function LevelBadge({ level }: { level: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${LEVEL_BADGE_COLORS[level] ?? "bg-gray-100 text-gray-700"}`}
    >
      {level}
    </span>
  );
}

function RoundCard({
  round,
  eventId,
  entering,
  enterError,
  prizes,
  showLevelBadge,
  onEnter,
}: {
  round: EventRound;
  eventId: string;
  entering: boolean;
  enterError?: string;
  prizes: PrizeResponse[] | null;
  showLevelBadge: boolean;
  onEnter: (round: EventRound) => void;
}) {
  const isDisabledState = round.your_status === "eliminated";
  const isWinner = round.your_status === "winner";
  const prize = isWinner ? findPrize(prizes, round.rank) : undefined;

  return (
    <Card className={isDisabledState ? "opacity-60" : undefined}>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-olympiad-900">{round.round_name}</h3>
            {showLevelBadge && <LevelBadge level={round.level} />}
          </div>
          <p className="text-sm text-text-muted">{formatDate(round.start_at)}</p>
        </div>
        {isWinner && (
          <span className="inline-flex items-center gap-2 rounded-full bg-medal-500/10 px-3 py-1.5 text-sm font-semibold text-medal-700 ring-1 ring-inset ring-medal-500/30">
            {round.rank != null ? `🏆 Winner — Rank ${round.rank}` : "🏆 Winner"}
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

        {isWinner && (
          <>
            <p className="text-sm font-medium text-medal-700">
              {round.rank != null
                ? `Congratulations — you placed #${round.rank} in this event!`
                : "Congratulations — you won this event!"}
            </p>
            {prize && (
              <p className="text-sm text-medal-700">
                You won: <span className="font-semibold">{prize.prize_name}</span>
                {prize.prize_description && (
                  <span className="mt-0.5 block text-xs text-text-muted">{prize.prize_description}</span>
                )}
              </p>
            )}
          </>
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
  const { user } = useAuth();
  const [data, setData] = useState<EventRoundsResponse | null>(null);
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [enteringId, setEnteringId] = useState<string | null>(null);
  const [enterErrors, setEnterErrors] = useState<Record<string, string>>({});
  const [prizes, setPrizes] = useState<PrizeResponse[] | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<MyRegistrationStatus | null>(null);

  async function load() {
    setLoading(true);
    setLoadError(null);
    setRegistrationStatus(null);
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

  // Prize tiers are only relevant to a winner, so this only fires once
  // getEventRounds has come back with at least one "winner" round —
  // students who never won never trigger this request.
  useEffect(() => {
    if (!data?.rounds.some((r) => r.your_status === "winner")) return;
    let cancelled = false;
    void getEventPrizes(eventId).then((rows) => {
      if (!cancelled) setPrizes(rows);
    });
    return () => {
      cancelled = true;
    };
  }, [data, eventId]);

  // Only round 1's your_status is ever "not_eligible" (see YourStatus on
  // the backend), so data.rounds[0] is always the relevant round here.
  const roundLevel = data?.rounds[0]?.level;
  const notEligible = data?.rounds[0]?.your_status === "not_eligible";
  const levelMismatch = Boolean(roundLevel && user?.level && user.level !== roundLevel);
  const verificationBlocked = user?.verification_status !== "verified";
  // Skip the extra request when a simpler reason (level or verification)
  // already explains "not_eligible" — resolveNotEligibleReason never
  // reaches the registration branch in that case anyway.
  const needsRegistrationStatus = notEligible && !levelMismatch && !verificationBlocked;

  useEffect(() => {
    if (!needsRegistrationStatus) return;
    let cancelled = false;
    getMyRegistrationStatus(eventId)
      .then((status) => {
        if (!cancelled) setRegistrationStatus(status);
      })
      .catch(() => {
        if (!cancelled) setRegistrationStatus(null);
      });
    return () => {
      cancelled = true;
    };
  }, [needsRegistrationStatus, eventId]);

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

  // Prefer the student's own profile level (always available once
  // onboarding is complete, independent of whether any round exists yet);
  // fall back to the first returned round's level otherwise. All rounds in
  // one response share the caller's level per the backend filter, except
  // the no-level-on-file edge case, which the per-card LevelBadge below
  // covers instead.
  const level = user?.level ?? data?.rounds[0]?.level ?? null;
  const hasMixedLevels = Boolean(data && new Set(data.rounds.map((r) => r.level)).size > 1);

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
          {level && (
            <p className="mt-1 text-sm text-text-muted">
              Showing rounds for: <span className="font-medium text-olympiad-800">{levelLabel(level)}</span>
            </p>
          )}

          {notEligible ? (
            <Card className="mt-8">
              <CardContent className="flex flex-col gap-3">
                {(() => {
                  const reason = resolveNotEligibleReason(roundLevel, user, registrationStatus);
                  if (!reason) {
                    return <p className="text-sm text-text-muted">Checking your registration status…</p>;
                  }
                  return (
                    <>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-text-muted">{reason.en}</p>
                        <p className="text-sm text-text-muted">{reason.bn}</p>
                      </div>
                      <Link
                        href={reason.linkHref}
                        className="w-fit text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
                      >
                        {reason.linkEn} / {reason.linkBn}
                      </Link>
                    </>
                  );
                })()}
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
                    prizes={prizes}
                    showLevelBadge={hasMixedLevels}
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
