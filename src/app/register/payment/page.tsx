"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ApiError } from "@/lib/api/client";
import {
  getMyRegistrations,
  getRegistrationEvent,
  submitRegistration,
} from "@/lib/api/registrationsApi";
import type {
  PaymentMethod,
  Registration,
  RegistrationEvent,
} from "@/types/registration";

// bKash personal-retail transaction IDs are 10 alphanumeric characters
// (e.g. 8N7A6B5C4D). Nagad's are alphanumeric and vary in length; 8–14
// covers what it issues in practice. The admin still checks every ID by
// hand against the statement, so these guards only catch obvious typos.
const TRX_ID_RULES: Record<PaymentMethod, { pattern: RegExp; hint: string }> = {
  bkash: {
    pattern: /^[A-Z0-9]{10}$/,
    hint: "A bKash Transaction ID is 10 letters and digits, e.g. 8N7A6B5C4D.",
  },
  nagad: {
    pattern: /^[A-Z0-9]{8,14}$/,
    hint: "A Nagad Transaction ID is 8–14 letters and digits.",
  },
};

// Bangladeshi mobile number: 01, an operator digit, then 8 more digits.
// Accepts an optional +880 / 880 prefix and strips spaces/dashes.
function normalizeMobile(raw: string): string | null {
  let n = raw.replace(/[\s-]/g, "").replace(/^\+/, "");
  if (n.startsWith("880")) n = "0" + n.slice(3);
  return /^01[3-9]\d{8}$/.test(n) ? n : null;
}

function StatusBadge({ status }: { status: Registration["status"] }) {
  const styles: Record<Registration["status"], string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    rejected: "bg-red-50 text-red-700 ring-red-600/20",
  };
  const label: Record<Registration["status"], string> = {
    pending: "Pending approval",
    approved: "Approved",
    rejected: "Rejected",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {label[status]}
    </span>
  );
}

function PaymentContent() {
  const [event, setEvent] = useState<RegistrationEvent | null>(null);
  const [existing, setExisting] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [method, setMethod] = useState<PaymentMethod>("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{ sender?: string; trx?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [ev, mine] = await Promise.all([getRegistrationEvent(), getMyRegistrations()]);
      setEvent(ev);
      setExisting(ev ? mine.find((r) => r.event_id === ev.id) ?? null : (mine[0] ?? null));
      // Default the method selector to a wallet the event actually has.
      if (ev && !ev.bkash_number && ev.nagad_number) setMethod("nagad");
    } catch {
      setLoadError("We couldn't load the registration details. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const availableMethods: PaymentMethod[] = event
    ? ([
        event.bkash_number ? "bkash" : null,
        event.nagad_number ? "nagad" : null,
      ].filter(Boolean) as PaymentMethod[])
    : [];

  const payNumber = method === "bkash" ? event?.bkash_number : event?.nagad_number;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!event) return;
    setFormError(null);

    const normalizedSender = normalizeMobile(senderNumber);
    const trx = transactionId.trim().toUpperCase();
    const errors: { sender?: string; trx?: string } = {};
    if (!normalizedSender) {
      errors.sender = "Enter the 11-digit mobile number you paid from, e.g. 01712345678.";
    }
    if (!TRX_ID_RULES[method].pattern.test(trx)) {
      errors.trx = TRX_ID_RULES[method].hint;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const created = await submitRegistration({
        event_id: event.id,
        payment_method: method,
        sender_number: normalizedSender!,
        transaction_id: trx,
      });
      setExisting(created);
    } catch (err) {
      if (err instanceof ApiError) {
        // The backend returns a specific 409/400 message for each case;
        // surface it inline rather than a generic failure.
        if (err.status === 409 || err.status === 404 || err.status === 400) {
          setFormError(err.message);
        } else if (err.status === 401) {
          setFormError("Your session expired. Please refresh the page and sign in again.");
        } else {
          setFormError("Something went wrong submitting your payment. Please try again.");
        }
      } else {
        setFormError("Something went wrong submitting your payment. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Final step
        </span>
        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Registration payment</h1>
        <p className="mt-2 text-sm text-olympiad-800/70">
          Send the fee with bKash or Nagad, then enter your transaction details below. An admin
          confirms your payment and completes your registration.
        </p>

        {loading ? (
          <p className="mt-8 text-sm text-olympiad-800/70">Loading…</p>
        ) : loadError ? (
          <Card className="mt-8">
            <CardContent className="flex flex-col items-start gap-3">
              <p className="text-sm text-red-600">{loadError}</p>
              <Button size="sm" variant="outline" onClick={() => void load()}>
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : !event ? (
          <Card className="mt-8">
            <CardContent>
              <p className="text-sm text-olympiad-800/70">
                There is no exam open for registration right now. Check back once the next
                olympiad is announced.
              </p>
            </CardContent>
          </Card>
        ) : existing ? (
          <Card className="mt-8">
            <CardHeader>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
                Your registration
              </h2>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="font-medium text-olympiad-900">{event.title}</span>
                <StatusBadge status={existing.status} />
              </div>
              <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                <Detail label="Payment method" value={existing.payment_method.toUpperCase()} />
                <Detail label="Paid from" value={existing.sender_number} />
                <Detail label="Transaction ID" value={existing.transaction_id} />
                <Detail
                  label="Submitted"
                  value={new Date(existing.created_at).toLocaleString()}
                />
              </dl>
              {existing.status === "pending" && (
                <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  Your payment is awaiting manual verification. You&apos;ll see the status update
                  here and on your dashboard once an admin reviews it — no need to pay again.
                </p>
              )}
              {existing.status === "rejected" && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  An admin could not match this payment. Please contact support with your
                  transaction details.
                </p>
              )}
              {existing.status === "approved" && (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Your payment is confirmed and you are registered for this exam.
                </p>
              )}
            </CardContent>
            <CardFooter>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-olympiad-500 hover:text-olympiad-800"
              >
                Go to dashboard
              </Link>
            </CardFooter>
          </Card>
        ) : (
          <>
            <Card className="mt-8">
              <CardHeader>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
                  How to pay
                </h2>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-olympiad-800/80">{event.title} — registration fee</span>
                  <span className="font-semibold text-olympiad-900">
                    {event.registration_fee > 0 ? `৳ ${event.registration_fee}` : "৳ — (to be confirmed)"}
                  </span>
                </div>
                <p className="text-olympiad-800/70">
                  Use <span className="font-medium">Send Money</span> to one of these numbers, then
                  enter the details below:
                </p>
                <ul className="flex flex-col gap-2">
                  {event.bkash_number && (
                    <li className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-2">
                      <span className="font-medium text-[#e2136e]">bKash</span>
                      <span className="font-mono text-olympiad-900">{event.bkash_number}</span>
                    </li>
                  )}
                  {event.nagad_number && (
                    <li className="flex items-center justify-between rounded-xl border border-black/5 bg-gray-50 px-4 py-2">
                      <span className="font-medium text-[#ec1c24]">Nagad</span>
                      <span className="font-mono text-olympiad-900">{event.nagad_number}</span>
                    </li>
                  )}
                  {availableMethods.length === 0 && (
                    <li className="rounded-xl bg-amber-50 px-4 py-3 text-amber-800">
                      Payment numbers for this exam haven&apos;t been published yet. Please check
                      back shortly.
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>

            {availableMethods.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
                    Enter your payment
                  </h2>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="flex flex-col gap-4">
                    <Select
                      label="Payment method"
                      value={method}
                      onChange={(e) => {
                        setMethod(e.target.value as PaymentMethod);
                        setFieldErrors((prev) => ({ ...prev, trx: undefined }));
                      }}
                    >
                      {availableMethods.map((m) => (
                        <option key={m} value={m}>
                          {m === "bkash" ? "bKash" : "Nagad"}
                        </option>
                      ))}
                    </Select>

                    {payNumber && (
                      <p className="-mt-1 text-xs text-olympiad-800/60">
                        Paying {method === "bkash" ? "bKash" : "Nagad"} number{" "}
                        <span className="font-mono">{payNumber}</span>
                      </p>
                    )}

                    <Input
                      label="Your mobile number (the one you paid from)"
                      inputMode="numeric"
                      placeholder="01712345678"
                      value={senderNumber}
                      error={fieldErrors.sender}
                      onChange={(e) => setSenderNumber(e.target.value)}
                    />

                    <Input
                      label="Transaction ID (TrxID)"
                      placeholder={method === "bkash" ? "8N7A6B5C4D" : "e.g. 71A2B3C4D5"}
                      value={transactionId}
                      error={fieldErrors.trx}
                      onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                      autoCapitalize="characters"
                      spellCheck={false}
                    />
                    {!fieldErrors.trx && (
                      <p className="-mt-2 text-xs text-olympiad-800/60">
                        {TRX_ID_RULES[method].hint} It&apos;s in the bKash/Nagad confirmation SMS.
                      </p>
                    )}

                    {formError && (
                      <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                        {formError}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3">
                    <Button type="submit" size="lg" className="w-full" loading={submitting}>
                      Apply for registration
                    </Button>
                    <p className="text-center text-xs text-olympiad-800/60">
                      Submitting does not charge you — you&apos;ve already paid via bKash/Nagad.
                      An admin verifies the transaction manually.
                    </p>
                  </CardFooter>
                </form>
              </Card>
            )}

            <p className="mt-4 text-center text-sm text-olympiad-800/70">
              <Link href="/rules" className="font-medium text-olympiad-500 hover:text-olympiad-800">
                Back to rules
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-olympiad-800/50">{label}</dt>
      <dd className="mt-0.5 font-medium text-olympiad-900">{value}</dd>
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
