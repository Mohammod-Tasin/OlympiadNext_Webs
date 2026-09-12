import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | OlympiadNext",
  description: "View and update your OlympiadNext profile, institution details, and notification preferences.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
