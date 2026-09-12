import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard | OlympiadNext",
  description: "View your exam registrations, admit cards, and upcoming olympiad events.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
