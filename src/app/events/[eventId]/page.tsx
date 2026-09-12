import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { EventRoundsContent } from "./EventRoundsContent";

export default async function EventRoundsPage(props: PageProps<"/events/[eventId]">) {
  const { eventId } = await props.params;

  return (
    <ProtectedRoute>
      <EventRoundsContent eventId={eventId} />
    </ProtectedRoute>
  );
}
