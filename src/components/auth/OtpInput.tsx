"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils/cn";

const LENGTH = 6;

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** Six distinct single-digit boxes with auto-advance, backspace, and paste support. */
export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  function setDigit(index: number, digit: string) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").slice(0, LENGTH));
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, digit);
    if (digit && index < LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  }

  function handlePaste(index: number, e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = digits.slice();
    for (let i = 0; i < pasted.length && index + i < LENGTH; i++) {
      next[index + i] = pasted[i];
    }
    onChange(next.join("").slice(0, LENGTH));
    inputs.current[Math.min(index + pasted.length, LENGTH - 1)]?.focus();
  }

  return (
    <div className="flex justify-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={(e) => handlePaste(index, e)}
          disabled={disabled}
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          className={cn(
            "h-12 w-11 rounded-xl border border-gray-200 bg-gray-50 text-center text-lg font-medium text-olympiad-900",
            "focus:border-olympiad-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-olympiad-300",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}
