import type { Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Settings | OlympiadNext",
  description: "Manage your account settings.",
};

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Settings</h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-muted">Coming soon — account settings will live here.</p>
      </CardContent>
    </Card>
  );
}
