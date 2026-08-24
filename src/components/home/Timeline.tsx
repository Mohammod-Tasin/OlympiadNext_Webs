const EVENTS = [
  { date: "Jan 15, 2026", title: "Registration Opens", description: "Registration portal opens for all schools and students." },
  { date: "Mar 1, 2026", title: "Registration Deadline", description: "Last date to complete registration and payment." },
  { date: "Apr 5, 2026", title: "Mock Test Date", description: "Timed mock test to help participants prepare." },
  { date: "May 10, 2026", title: "Main Olympiad Date", description: "The final olympiad exam takes place." },
];

export function Timeline() {
  return (
    <section className="bg-olympiad-50">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-olympiad-900 sm:text-3xl">Important Dates</h2>
        <ol className="mt-10 flex flex-col gap-10 border-l-2 border-olympiad-300 pl-6">
          {EVENTS.map((event) => (
            <li key={event.title} className="relative">
              <span className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-olympiad-500" />
              <p className="text-xs font-semibold uppercase tracking-wide text-olympiad-500">{event.date}</p>
              <h3 className="mt-1 text-base font-semibold text-olympiad-900">{event.title}</h3>
              <p className="mt-1 text-sm text-olympiad-800/80">{event.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
