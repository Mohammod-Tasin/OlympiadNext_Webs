"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/lib/auth/useAuth";

export function GoogleSignInButton({ onError }: { onError?: (message: string) => void }) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();

  const handleSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      if (!credentialResponse.credential) {
        onError?.("Google sign-in failed. Please try again.");
        return;
      }
      try {
        await loginWithGoogle(credentialResponse.credential);
        router.push("/dashboard");
      } catch {
        onError?.("Google sign-in failed. Please try again.");
      }
    },
    [loginWithGoogle, onError, router],
  );

  const handleError = useCallback(() => {
    onError?.("Google sign-in failed. Please try again.");
  }, [onError]);

  return <GoogleLogin onSuccess={handleSuccess} onError={handleError} />;
}
