import type { Metadata } from "next";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EventRoundsContent } from "./EventRoundsContent";

export const metadata: Metadata = {
  title: "Event Rounds | OlympiadNext",
  description: "View your entry status and enter ongoing rounds for this olympiad event.",
};

export default async function EventRoundsPage(props: PageProps<"/events/[eventId]">) {
  const { eventId } = await props.params;

  return (
    <ProtectedRoute>
      <EventRoundsContent eventId={eventId} />
    </ProtectedRoute>
  );
}
