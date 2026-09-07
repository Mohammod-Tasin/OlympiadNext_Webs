"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// UI skeleton only — no payment gateway is wired up. The fee is shown as a
// placeholder until the final amount is confirmed.
const LINE_ITEMS: Array<{ label: string; amount: string }> = [
  { label: "Olympiad Registration Fee", amount: "৳ —" },
];

function PaymentContent() {
  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Final step
        </span>

        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Payment</h1>
        <p className="mt-2 text-sm text-olympiad-800/70">
          Review your registration order below and complete payment to confirm your spot.
        </p>

        <Card className="mt-8">
          <CardHeader>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">Order Summary</h2>
          </CardHeader>

          <CardContent className="flex flex-col gap-3">
            {LINE_ITEMS.map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 text-sm">
                <span className="text-olympiad-800/80">{item.label}</span>
                <span className="font-medium text-olympiad-900">{item.amount}</span>
              </div>
            ))}

            <div className="mt-2 flex items-center justify-between gap-4 border-t border-black/5 pt-3">
              <span className="text-sm font-semibold text-olympiad-900">Total</span>
              <span className="text-sm font-semibold text-olympiad-900">৳ —</span>
            </div>

            <p className="text-xs text-olympiad-800/60">
              The registration fee is still being finalized. The final amount will be shown here
              before any charge is made.
            </p>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <div className="flex items-start gap-3 rounded-xl border border-olympiad-500/20 bg-olympiad-50 px-4 py-3 text-sm text-olympiad-800">
              <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
                <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Payment integration coming soon. Online payment is not available yet.</span>
            </div>

            <Button className="w-full" size="lg" disabled>
              Pay ৳ —
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-4 text-center text-sm text-olympiad-800/70">
          <Link href="/rules" className="font-medium text-olympiad-500 hover:text-olympiad-800">
            Back to rules
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <ProtectedRoute>
      <PaymentContent />
    </ProtectedRoute>
  );
}
