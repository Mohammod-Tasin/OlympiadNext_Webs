import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";

export type StepperStep = "account" | "verify" | "payment" | "done";

const STEPS: Array<{ key: StepperStep; label: string }> = [
  { key: "account", label: "Account" },
  { key: "verify", label: "Verify" },
  { key: "payment", label: "Payment" },
  { key: "done", label: "Done" },
];

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Stepper({ currentStep, className }: { currentStep: StepperStep; className?: string }) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep);

  return (
    <ol className={cn("flex flex-col sm:flex-row", className)}>
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <Fragment key={step.key}>
            <li className="flex flex-row items-center gap-3 sm:flex-1 sm:flex-col sm:items-center sm:gap-2 sm:text-center">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                  isCompleted && "bg-olympiad-800 text-white",
                  isCurrent && "bg-white text-olympiad-800 ring-2 ring-olympiad-500",
                  !isCompleted && !isCurrent && "bg-olympiad-100 text-olympiad-800/60",
                )}
              >
                {isCompleted ? <CheckIcon /> : i + 1}
              </span>
              <span
                className={cn(
                  "text-sm font-medium",
                  isCompleted || isCurrent ? "text-olympiad-900" : "text-text-muted",
                )}
              >
                {step.label}
              </span>
            </li>

            {i < STEPS.length - 1 && (
              <>
                <div className="ml-4 h-6 w-0.5 bg-olympiad-300 sm:hidden" aria-hidden="true" />
                <div className="hidden h-0.5 flex-1 self-center bg-olympiad-300 sm:mt-4 sm:block" aria-hidden="true" />
              </>
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
