"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import type { User } from "@/types/auth";

const ONBOARDING_PATH = "/onboarding";

function isProfileIncomplete(user: User | null): boolean {
  return !user || !user.full_name || !user.institution_name || !user.is_phone_verified || !user.is_email_verified;
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // /onboarding is exempt from the profile-completeness check below, or
  // finishing onboarding would immediately redirect back into itself.
  const needsOnboarding = status === "authenticated" && pathname !== ONBOARDING_PATH && isProfileIncomplete(user);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (needsOnboarding) {
      router.replace(ONBOARDING_PATH);
    }
  }, [status, needsOnboarding, router]);

  if (status !== "authenticated" || needsOnboarding) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
