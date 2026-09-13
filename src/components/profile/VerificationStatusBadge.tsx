import { cn } from "@/lib/utils/cn";
import type { VerificationStatus } from "@/types/auth";

// Mirrors REGISTRATION_BADGE's shape/color convention (DashboardClient.tsx)
// for visual consistency between the two status-pill systems.
const VERIFICATION_STATUS_BADGE: Record<VerificationStatus, { label: string; className: string }> = {
  unverified: { label: "Not Submitted", className: "bg-gray-100 text-gray-700" },
  pending: { label: "Pending Review", className: "bg-amber-50 text-amber-700" },
  verified: { label: "Verified", className: "bg-emerald-50 text-emerald-700" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700" },
};

/** Small KYC-status pill, shared between ProfileClient.tsx and
 * DashboardSidebar.tsx. Missing status (not yet loaded) reads as
 * "unverified" — the same default ProtectedRoute treats a null user as. */
export function VerificationStatusBadge({
  status,
  className,
}: {
  status?: VerificationStatus;
  className?: string;
}) {
  const badge = VERIFICATION_STATUS_BADGE[status ?? "unverified"];
  return (
    <span
      className={cn(
        "inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
        badge.className,
        className,
      )}
    >
      {badge.label}
    </span>
  );
}
