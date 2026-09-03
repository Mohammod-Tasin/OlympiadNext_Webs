"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface CountdownTimerProps {
  /** ISO 8601 datetime string (with an explicit offset) to count down to. */
  targetDate: string;
  /** Extra classes for the outer container — e.g. `justify-end` to align
   * the segment boxes against the right margin. */
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const SEGMENTS: Array<{ key: keyof TimeLeft; label: string }> = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
];

function getTimeLeft(targetDate: string): TimeLeft | null {
  const diffMs = new Date(targetDate).getTime() - Date.now();
  if (diffMs <= 0) return null;

  const totalSeconds = Math.floor(diffMs / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function Segment({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-black/5 bg-white/90 px-3 py-2 shadow-[0_2px_10px_rgb(0,0,0,0.04)] backdrop-blur-sm sm:px-4 sm:py-3">
      <span className="text-2xl font-bold tabular-nums text-olympiad-900 sm:text-3xl">{value}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-olympiad-800/50 sm:text-xs">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  // undefined = not measured yet (SSR / pre-hydration), null = target has
  // passed. Computing this during render would use the server's clock,
  // which can be a tick or more off from the client's - so the countdown
  // is only ever computed inside the effect, after mount.
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | undefined>(undefined);

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (timeLeft === null) {
    return <p className={cn("text-sm font-medium text-olympiad-800", className)}>The event has started.</p>;
  }

  return (
    <div className={cn("flex gap-2 sm:gap-3", className)}>
      {SEGMENTS.map((segment) => (
        <Segment key={segment.key} value={timeLeft ? pad(timeLeft[segment.key]) : "--"} label={segment.label} />
      ))}
    </div>
  );
}
