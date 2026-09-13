import type { Metadata } from "next";
import { DashboardClient } from "./DashboardClient";

export const metadata: Metadata = {
  title: "Exam Registrations | Shikhor",
  description: "View your exam registrations, review status, and admit cards.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
