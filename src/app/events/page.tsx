import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { getAllEvents } from "@/lib/api/eventsApi";
import { formatEventDate } from "@/lib/utils/formatEventDate";

export const metadata: Metadata = {
  title: "All Events | OlympiadNext",
  description: "Browse every olympiad event hosted on OlympiadNext, active and past.",
};

/**
 * The single active event's registration flow (`/rules` → payment) isn't
 * parameterized by event id — it always targets whatever `GET
 * /api/client/events` currently reports active. So the active event's card
 * reuses that exact `/rules` link (the homepage hero's own "Register
 * Now"/"See Details" target), while every other event routes to its own
 * `/events/{id}` detail/rounds page instead of the (potentially wrong)
 * shared registration flow.
 */
export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-olympiad-900 sm:text-3xl">All Events</h1>
        <p className="mt-1 text-sm text-text-muted">Every olympiad hosted on OlympiadNext, active and past.</p>

        {events.length === 0 ? (
          <Card className="mt-8">
            <CardContent>
              <p className="text-sm text-text-muted">No events available right now — check back soon.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <Card key={event.id} className="flex flex-col overflow-hidden">
                {event.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={event.image_url} alt="" className="h-40 w-full object-cover" />
                )}
                <CardContent className="flex flex-1 flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-base font-semibold text-olympiad-900">{event.title}</h2>
                    {event.is_active && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 text-sm text-text-muted">
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0 text-olympiad-500" aria-hidden="true">
                      <rect x="3.5" y="5" width="17" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M3.5 9.5h17M8 3v3M16 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    {formatEventDate(event.event_date)}
                  </div>

                  {event.description && (
                    <p className="line-clamp-3 flex-1 text-sm text-text-muted">{event.description}</p>
                  )}

                  <Link
                    href={event.is_active ? "/rules" : `/events/${event.id}`}
                    className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
                  >
                    {event.is_active ? "Register Now" : "View Details"}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
