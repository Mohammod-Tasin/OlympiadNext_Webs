import { Button } from "@/components/ui/Button";

const SUBJECTS = ["All", "Mathematics", "Physics", "Chemistry", "Biology"];

export function Champions() {
  return (
    <section className="bg-olympiad-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-olympiad-900 sm:text-3xl">Champions</h2>
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
          <p className="text-sm font-medium text-olympiad-900">
            Our first cohort&apos;s results will appear here once available.
          </p>
          <p lang="bn" className="text-sm text-text-muted">
            আমাদের প্রথম ব্যাচের ফলাফল প্রকাশিত হলে এখানে দেখা যাবে।
          </p>
        </div>
      </div>
    </section>
  );
}
