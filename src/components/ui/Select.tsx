import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, id, className, disabled, children, ...props },
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const errorId = `${selectId}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-olympiad-900">
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        disabled={disabled}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? errorId : undefined}
        className={cn(
          "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-olympiad-900",
          "focus:border-olympiad-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-olympiad-300",
          "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
});
