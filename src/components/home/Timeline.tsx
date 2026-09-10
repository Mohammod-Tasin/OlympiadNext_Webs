import { getImportantDates } from "@/lib/api/importantDatesApi";

/** "2026-01-15" -> "Jan 15, 2026". An unparseable value is shown unchanged. */
function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export async function Timeline() {
  const dates = await getImportantDates();

  return (
    <section className="bg-olympiad-50">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-olympiad-900 sm:text-3xl">Important Dates</h2>
        {dates.length === 0 ? (
          <p className="mt-10 text-center text-sm text-olympiad-800/70">
            Important dates will be announced soon.
          </p>
        ) : (
          <ol className="mt-10 flex flex-col gap-10 border-l-2 border-olympiad-300 pl-6">
            {dates.map((entry) => (
              <li key={entry.id} className="relative">
                <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-olympiad-500" />
                <p className="text-xs font-semibold uppercase tracking-wide text-olympiad-500">{formatDate(entry.event_date)}</p>
                <h3 className="mt-1 text-base font-semibold text-olympiad-900">{entry.title}</h3>
                <p className="mt-1 text-sm text-olympiad-800/80">{entry.details_en}</p>
                <p lang="bn" className="mt-1 text-sm leading-relaxed text-olympiad-800/70">{entry.details_bn}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
