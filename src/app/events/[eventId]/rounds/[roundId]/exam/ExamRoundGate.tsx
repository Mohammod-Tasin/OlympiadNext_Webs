"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { ApiError } from "@/lib/api/client";
import { enterRound } from "@/lib/api/roundsApi";

type GateState = { status: "checking" } | { status: "allowed" } | { status: "denied"; reason: string };

// Re-verifies round entry on every load rather than trusting that the
// visitor arrived via the "Enter Exam" button — enterRound is the same
// server-side gate that button already calls, so direct/bookmarked/shared
// URLs to this page get the same protection. A network failure is treated
// as denied, not allowed, so the gate never fails open.
export function ExamRoundGate({ eventId, roundId }: { eventId: string; roundId: string }) {
  const [gate, setGate] = useState<GateState>({ status: "checking" });

  useEffect(() => {
    let cancelled = false;
    setGate({ status: "checking" });
    enterRound(roundId)
      .then(() => {
        if (!cancelled) setGate({ status: "allowed" });
      })
      .catch((err) => {
        if (cancelled) return;
        const reason = err instanceof ApiError ? err.message : "Something went wrong checking your access. Please try again.";
        setGate({ status: "denied", reason });
      });
    return () => {
      cancelled = true;
    };
  }, [roundId]);

  if (gate.status === "checking") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center" role="status" aria-label="Checking access">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-olympiad-500" />
      </div>
    );
  }

  if (gate.status === "denied") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
          <h1 className="text-xl font-bold text-olympiad-900">You don&apos;t have access to this round</h1>
          <p className="text-sm text-text-muted">{gate.reason}</p>
          <Link
            href={`/events/${eventId}`}
            className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
          >
            Back to event
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
        <h1 className="text-xl font-bold text-olympiad-900">Exam session started</h1>
        <p className="text-sm text-text-muted">The exam interface is coming soon.</p>
      </CardContent>
    </Card>
  );
}
