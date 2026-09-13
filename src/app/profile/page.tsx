import type { Metadata } from "next";
import { ProfileClient } from "./ProfileClient";

export const metadata: Metadata = {
  title: "My Profile | Shikhor",
  description: "View and update your Shikhor profile, institution details, and notification preferences.",
};

export default function ProfilePage() {
  return <ProfileClient />;
}
