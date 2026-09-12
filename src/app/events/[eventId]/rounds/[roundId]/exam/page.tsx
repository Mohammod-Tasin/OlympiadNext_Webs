import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Exam | OlympiadNext",
  description: "Your olympiad exam session.",
};

// Placeholder landing spot after a successful `enter` call — the real exam
// interface (question rendering, timer, submission) is future scope.
export default async function ExamPlaceholderPage(props: PageProps<"/events/[eventId]/rounds/[roundId]/exam">) {
  await props.params;

  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <h1 className="text-xl font-bold text-olympiad-900">Exam session started</h1>
            <p className="text-sm text-text-muted">The exam interface is coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
