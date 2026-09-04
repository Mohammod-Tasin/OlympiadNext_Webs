"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import type { User } from "@/types/auth";

const ONBOARDING_PATH = "/onboarding";

// A user must finish onboarding while any academic field is still missing or
// the account has not left the `unverified` state (no verification document
// submitted yet). `pending` accounts are considered done — they browse
// freely; only exam entry stays gated (a future concern).
function needsOnboarding(user: User | null): boolean {
  if (!user) return true;
  const missingDetails = !user.full_name || !user.institution_name || !user.level || !user.medium;
  return missingDetails || user.status === "unverified";
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // /onboarding is exempt from the completeness check below, or finishing
  // onboarding would immediately redirect back into itself.
  const mustOnboard =
    status === "authenticated" && pathname !== ONBOARDING_PATH && needsOnboarding(user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (mustOnboard) {
      router.replace(ONBOARDING_PATH);
    }
  }, [status, mustOnboard, router]);

  if (status !== "authenticated" || mustOnboard) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center" role="status" aria-label="Loading">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-olympiad-500" />
      </div>
    );
  }

  return <>{children}</>;
}
