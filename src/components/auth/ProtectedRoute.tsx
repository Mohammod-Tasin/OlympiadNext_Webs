"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth/useAuth";

const VERIFY_PATH = "/verify";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // /verify is itself a protected route, so it must be exempt from this
  // check — otherwise an unverified user would be redirected to /verify
  // and immediately redirected away from it again.
  const needsVerification = !!user && (!user.is_email_verified || !user.is_phone_verified);
  const mustGoToVerify = needsVerification && pathname !== VERIFY_PATH;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    } else if (status === "authenticated" && mustGoToVerify) {
      router.replace(VERIFY_PATH);
    }
  }, [status, mustGoToVerify, router]);

  if (status !== "authenticated" || mustGoToVerify) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
