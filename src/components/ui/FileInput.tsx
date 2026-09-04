"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface FileInputProps {
  /** Field label — may hold bilingual text; rendered with `font-sans` so
   * the system font handles Bengali. */
  label?: ReactNode;
  /** Secondary helper line under the label. */
  hint?: ReactNode;
  error?: string;
  /** Native `accept` attribute, e.g. `"image/*,application/pdf"`. */
  accept?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * File picker styled to match `Input`/`Select`. The native input is visually
 * hidden; a dashed button triggers it, and once a file is chosen it swaps to
 * a card showing the name, size, an image thumbnail (for images) and a
 * remove control. Validation is left to the caller (`error` prop) so the
 * hidden input never traps native form focus.
 */
export function FileInput({
  label,
  hint,
  error,
  accept,
  required,
  disabled,
  id,
  file,
  onFileChange,
}: FileInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  function clear() {
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-1.5 font-sans">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium leading-relaxed text-olympiad-900">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      {hint && <p className="text-xs leading-relaxed text-olympiad-800/60">{hint}</p>}

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />

      {file ? (
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-2.5",
            error && "border-red-500",
          )}
        >
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={previewUrl} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-olympiad-500/10 text-olympiad-500">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M6.5 3.5h8L18.5 8v12.5a1 1 0 01-1 1h-11a1 1 0 01-1-1v-16a1 1 0 011-1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <path d="M14.5 3.5V8h4" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-olympiad-900">{file.name}</p>
            <p className="text-xs text-olympiad-800/50">{formatBytes(file.size)}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg px-2 py-1 text-xs font-medium text-olympiad-500 hover:bg-olympiad-50 disabled:opacity-50"
            >
              Change
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={clear}
              aria-label="Remove file"
              className="rounded-lg p-1.5 text-olympiad-800/50 hover:bg-black/5 hover:text-olympiad-900 disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-3 py-3 text-sm text-olympiad-800/70",
            "hover:border-olympiad-500 hover:text-olympiad-800",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-olympiad-300",
            "disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-red-500",
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0" aria-hidden="true">
            <path
              d="M12 15V4m0 0L8 8m4-4l4 4M5 15v3.5a1 1 0 001 1h12a1 1 0 001-1V15"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Choose a file
        </button>
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
