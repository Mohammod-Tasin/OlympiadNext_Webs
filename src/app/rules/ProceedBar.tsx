"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

/**
 * Sticky action bar for the rules page. Stays pinned to the bottom of the
 * viewport while the terms scroll behind it, then comes to rest above the
 * footer. "Proceed" advances to the (login-gated) payment step.
 */
export function ProceedBar() {
  const router = useRouter();

  return (
    <div className="sticky bottom-0 z-30 border-t border-black/5 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-3xl flex-col items-stretch gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-text-muted">
          By continuing you accept the rules and terms above.
        </p>
        <Button
          size="lg"
          className="shrink-0"
          onClick={() => router.push("/register/payment")}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
}
