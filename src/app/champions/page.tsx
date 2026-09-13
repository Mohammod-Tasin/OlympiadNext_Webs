import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Champions | OlympiadNext",
  description: "Meet the top performers and champions from OlympiadNext's olympiad events.",
};

const SUBJECTS = ["All", "Mathematics", "Physics", "Chemistry", "Biology"];

export default function ChampionsPage() {
  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-olympiad-900 sm:text-3xl">Champions</h1>
          <span className="mx-auto mt-4 block h-1 w-16 rounded-full bg-medal-500" aria-hidden="true" />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3">
          <div className="flex flex-wrap justify-center gap-2">
            {SUBJECTS.map((subject) => (
              <Button key={subject} variant={subject === "All" ? "primary" : "outline"} size="sm" disabled>
                {subject}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button variant="primary" size="sm" disabled>
              2026
            </Button>
          </div>
        </div>

        <div className="mt-10 flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-olympiad-200 px-6 py-12 text-center">
          <p className="text-sm font-medium text-olympiad-900">Champion candidates&apos; names will appear here.</p>
          <p lang="bn" className="text-sm text-text-muted">
            চ্যাম্পিয়ন প্রার্থীদের নাম এখানে প্রদর্শিত হবে।
          </p>
        </div>
      </div>
    </div>
  );
}
