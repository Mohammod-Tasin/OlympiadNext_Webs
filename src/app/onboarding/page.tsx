import type { Metadata } from "next";
import { OnboardingClient } from "./OnboardingClient";

export const metadata: Metadata = {
  title: "Complete Your Profile | OlympiadNext",
  description: "Add your institution and academic details to finish setting up your OlympiadNext account.",
};

export default function OnboardingPage() {
  return <OnboardingClient />;
}
