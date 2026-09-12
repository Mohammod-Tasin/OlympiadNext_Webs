import { cn } from "@/lib/utils/cn";

export function SectionSkeleton({
  className = "bg-olympiad-50",
  blockClassName = "bg-olympiad-100",
  heightClassName = "h-48",
}: {
  className?: string;
  blockClassName?: string;
  heightClassName?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className={cn("animate-pulse rounded-2xl", blockClassName, heightClassName)} />
      </div>
    </section>
  );
}
