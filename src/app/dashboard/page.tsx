"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/mock-tests", label: "Mock Tests" },
  { href: "/dashboard/results", label: "Results" },
  { href: "/dashboard/settings", label: "Settings" },
];

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 md:flex-row">
      <aside className="w-full shrink-0 md:w-56">
        <nav className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
          {SIDEBAR_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-olympiad-800 transition-colors hover:bg-olympiad-50"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="outline" size="sm" className="mt-4 w-full" onClick={handleLogout}>
          Logout
        </Button>
      </aside>

      <main className="flex-1">
        <h1 className="text-2xl font-bold text-olympiad-900">Welcome back, {user?.email}</h1>
        <p className="mt-1 text-sm text-olympiad-800/70">Here&apos;s what&apos;s happening with your account.</p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Profile Status</h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="text-olympiad-900">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-olympiad-900">
                <span className="font-medium">User ID:</span> {user?.user_id}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Upcoming Event</h2>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-olympiad-900">Mock Test</p>
              <p className="mt-1 text-olympiad-800/70">Apr 5, 2026 &middot; 10:00 AM</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Quick Actions</h2>
            </CardHeader>
            <CardContent>
              <Button variant="primary" size="sm" className="w-full">
                Download Admit Card
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
