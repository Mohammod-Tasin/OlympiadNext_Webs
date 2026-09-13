import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ExamRoundGate } from "./ExamRoundGate";

export const metadata: Metadata = {
  title: "Exam | Shikhor",
  description: "Your olympiad exam session.",
};

// Placeholder landing spot after a successful `enter` call — the real exam
// interface (question rendering, timer, submission) is future scope.
// ProtectedRoute only checks login + onboarding; ExamRoundGate re-runs the
// real POST /rounds/{id}/enter check so direct/bookmarked/shared links to
// this page can't skip round eligibility.
export default async function ExamPlaceholderPage(props: PageProps<"/events/[eventId]/rounds/[roundId]/exam">) {
  const { eventId, roundId } = await props.params;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <ExamRoundGate eventId={eventId} roundId={roundId} />
      </div>
    </ProtectedRoute>
  );
}
