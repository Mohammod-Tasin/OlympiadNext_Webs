import { cn } from "@/lib/utils/cn";

export interface AvatarProps {
  name?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "h-9 w-9 text-sm",
  md: "h-11 w-11 text-base",
  lg: "h-16 w-16 text-xl",
};

export function Avatar({ name, size = "md", className }: AvatarProps) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? "?";

  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-olympiad-500 font-semibold text-white",
        SIZE_CLASSES[size],
        className,
      )}
    >
      {initial}
    </div>
  );
}
