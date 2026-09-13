"use client";

import { Fragment, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { getMyRegistrations } from "@/lib/api/registrationsApi";
import type { Registration } from "@/types/registration";
import { cn } from "@/lib/utils/cn";

/** Verbatim bilingual copy — do not paraphrase. Titles were dropped: each
 * step is now the English sentence with its Bengali translation beneath. */
const STEPS: Array<{ en: string; bn: string }> = [
  {
    en: "Register with your school details and required documents.",
    bn: "আপনার স্কুলের তথ্য ও প্রয়োজনীয় কাগজপত্র দিয়ে নিবন্ধন করুন।",
  },
  {
    en: "Complete your registration by making the payment.",
    bn: "পেমেন্ট সম্পন্ন করে আপনার নিবন্ধন নিশ্চিত করুন।",
  },
  {
    en: "Once your payment is verified, you'll be notified by email or SMS — download your admit card from your dashboard.",
    bn: "পেমেন্ট যাচাই হলে ইমেইল বা এসএমএসের মাধ্যমে জানানো হবে। আপনার ড্যাশবোর্ড থেকে অ্যাডমিট কার্ড ডাউনলোড করুন।",
  },
  {
    en: "Practice with a timed mock test to prepare for the real exam.",
    bn: "মূল পরীক্ষার প্রস্তুতির জন্য সময়-নির্ধারিত মক টেস্ট অনুশীলন করুন।",
  },
  {
    en: "Sit for the main olympiad and compete for top honors.",
    bn: "মূল অলিম্পিয়াডে অংশগ্রহণ করে সেরাদের প্রতিযোগিতায় অংশ নিন।",
  },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** "You are here": which step to ring as current, and which are already
 * done, based on the caller's own registrations. Logged out (or not yet
 * loaded) means no highlight — a rejected-only registration is treated the
 * same as having none, matching `RegistrationFooter`'s own precedent that a
 * rejected registration has no path forward. */
function useHighlight() {
  const { status } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[] | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    let cancelled = false;
    getMyRegistrations()
      .then((rows) => {
        if (!cancelled) setRegistrations(rows);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [status]);

  if (status !== "authenticated" || registrations === null) {
    return { current: null as number | null, completed: new Set<number>() };
  }
  if (registrations.some((r) => r.status === "approved")) {
    return { current: null, completed: new Set([0, 1]) };
  }
  if (registrations.some((r) => r.status === "pending")) {
    return { current: 1, completed: new Set([0]) };
  }
  return { current: 0, completed: new Set<number>() };
}

function StepCircle({
  index,
  isCurrent,
  isCompleted,
  className,
}: {
  index: number;
  isCurrent: boolean;
  isCompleted: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-olympiad-500 text-sm font-bold text-white",
        isCurrent && "ring-2 ring-medal-500 ring-offset-2",
        className,
      )}
    >
      {isCompleted ? <CheckIcon /> : index + 1}
    </span>
  );
}

export function HowToParticipate() {
  const { current, completed } = useHighlight();

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-olympiad-900 sm:text-3xl">How to Participate</h2>

        {/* Mobile: vertical roadmap, same dot-on-line convention as Timeline.tsx. */}
        <ol className="mt-10 flex flex-col gap-8 border-l-2 border-olympiad-300 pl-8 sm:hidden">
          {STEPS.map((step, i) => (
            <li key={i} className="relative">
              <StepCircle
                index={i}
                isCurrent={current === i}
                isCompleted={completed.has(i)}
                className="absolute -left-[48px] top-0 h-8 w-8"
              />
              <p className="text-sm font-medium text-olympiad-900">{step.en}</p>
              <p lang="bn" className="mt-1 text-sm leading-relaxed text-text-muted">
                {step.bn}
              </p>
            </li>
          ))}
        </ol>

        {/* Desktop: horizontal roadmap, same connector technique as Stepper.tsx. */}
        <ol className="mt-10 hidden sm:flex sm:items-start">
          {STEPS.map((step, i) => (
            <Fragment key={i}>
              <li className="flex flex-1 flex-col items-center gap-3 px-2 text-center">
                <StepCircle index={i} isCurrent={current === i} isCompleted={completed.has(i)} className="h-10 w-10" />
                <p className="text-sm font-medium text-olympiad-900">{step.en}</p>
                <p lang="bn" className="text-sm leading-relaxed text-text-muted">
                  {step.bn}
                </p>
              </li>
              {i < STEPS.length - 1 && <div className="mt-5 h-0.5 flex-1 self-start bg-olympiad-300" aria-hidden="true" />}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
