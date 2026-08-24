import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const NOTICES = [
  "Registration is now open for the 2026 season!",
  "Admit cards will be available for download soon.",
  "Mock test schedule has been finalized — check the Timeline below.",
  "New districts added to the eligibility list this year.",
];

export function NoticeBoard() {
  return (
    <section className="bg-olympiad-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-olympiad-900">Notice Board</h2>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {NOTICES.map((notice) => (
                <li key={notice} className="flex items-start gap-3 text-sm text-olympiad-800">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olympiad-500" aria-hidden="true" />
                  <span>{notice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
