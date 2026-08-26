"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/useAuth";
import { ProfileSetupModal } from "@/components/auth/ProfileSetupModal";

const TOOLTIP_DURATION_MS = 5000;

export function ProfileSetupFAB() {
  const { status, user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const needsSetup =
    status === "authenticated" &&
    !!user &&
    (!user.is_email_verified ||
      !user.is_phone_verified ||
      !user.institution_name ||
      !user.level ||
      !user.medium);

  useEffect(() => {
    if (!needsSetup) return;
    setShowTooltip(true);
    const timer = setTimeout(() => setShowTooltip(false), TOOLTIP_DURATION_MS);
    return () => clearTimeout(timer);
  }, [needsSetup]);

  // Open the modal as soon as setup becomes necessary (e.g. right after a
  // Google OAuth sign-in) instead of waiting for the user to notice and
  // click the FAB. Only fires on the false -> true transition, so a user
  // who deliberately closes the modal isn't forced straight back into it.
  useEffect(() => {
    if (needsSetup) {
      setModalOpen(true);
    }
  }, [needsSetup]);

  if (!needsSetup) return null;

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {showTooltip && (
          <div
            role="status"
            className="max-w-[220px] animate-[tooltipIn_0.25s_cubic-bezier(0.16,1,0.3,1)] rounded-2xl border border-black/5 bg-white px-4 py-3 text-sm font-medium text-olympiad-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          >
            Finish setting up your profile to participate in exams.
          </div>
        )}

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label="Complete your profile setup"
          className="flex h-14 w-14 animate-[popIn_0.25s_cubic-bezier(0.16,1,0.3,1)] items-center justify-center rounded-full bg-olympiad-500 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-transform hover:scale-105 hover:bg-olympiad-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-olympiad-300 focus-visible:ring-offset-2 active:scale-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.18A1.5 1.5 0 003.5 20.5h17a1.5 1.5 0 001.39-2.46L13.71 3.86a1.5 1.5 0 00-2.42 0z"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <ProfileSetupModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
