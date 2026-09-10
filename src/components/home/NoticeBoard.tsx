import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { getNotices } from "@/lib/api/noticesApi";

export async function NoticeBoard() {
  const notices = await getNotices();

  return (
    <section className="bg-olympiad-50">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-olympiad-900">Notice Board</h2>
          </CardHeader>
          <CardContent>
            {notices.length === 0 ? (
              <p className="text-sm text-olympiad-800/70">
                No notices right now — check back soon.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {notices.map((notice) => (
                  <li key={notice.id} className="flex items-start gap-3 text-sm text-olympiad-800">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-olympiad-500" aria-hidden="true" />
                    <span>
                      {notice.text_en}{" "}
                      <span lang="bn" className="text-olympiad-800/70">({notice.text_bn})</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
