"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { uploadUserFile, updateUserProfile } from "@/lib/api/userApi";
import { ApiError } from "@/lib/api/client";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS } from "@/lib/constants/academic";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileInput } from "@/components/ui/FileInput";
import { Button } from "@/components/ui/Button";
import type { User } from "@/types/auth";

// Exact label copy mandated for the verification document field.
const VERIFICATION_DOC_LABEL =
  "Verification Document [যেকোনো প্রমাণপত্র যা নিশ্চিত করে আপনি ওই প্রতিষ্ঠানের ছাত্র (যেমন: আইডি কার্ড, বেতনের রশিদ, বা রেজাল্ট শিট)]";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const DOC_ACCEPT = "image/png,image/jpeg,image/webp,image/heic,application/pdf";
const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/heic";

function validateFile(file: File, accept: string): string | null {
  const allowed = accept.split(",");
  const ok = allowed.some((type) =>
    type.endsWith("/*") ? file.type.startsWith(type.slice(0, -1)) : file.type === type,
  );
  if (!ok) return "That file type isn't supported. Use an image or a PDF.";
  if (file.size > MAX_FILE_BYTES) return "File is too large — the limit is 10 MB.";
  return null;
}

// The user has finished onboarding once the academic fields are set and the
// account has left the `unverified` state (i.e. the document was submitted).
function onboardingComplete(user: User | null): boolean {
  return Boolean(
    user?.institution_name &&
      user?.level &&
      user?.medium &&
      user?.verification_status &&
      user.verification_status !== "unverified",
  );
}

function OnboardingContent() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();

  const [institutionName, setInstitutionName] = useState(user?.institution_name ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [medium, setMedium] = useState(user?.medium ?? "");
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const [docError, setDocError] = useState<string | null>(null);
  const [pictureError, setPictureError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Nothing left to collect — the user landed here via a stale redirect.
  const alreadyDone = onboardingComplete(user);

  useEffect(() => {
    if (alreadyDone) {
      router.replace("/dashboard");
    }
  }, [alreadyDone, router]);

  function pickVerificationDoc(file: File | null) {
    setVerificationDoc(file);
    setDocError(file ? validateFile(file, DOC_ACCEPT) : null);
  }

  function pickProfilePicture(file: File | null) {
    setProfilePicture(file);
    setPictureError(file ? validateFile(file, IMAGE_ACCEPT) : null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!verificationDoc) {
      setDocError("A verification document is required.");
      return;
    }
    const docIssue = validateFile(verificationDoc, DOC_ACCEPT);
    const pictureIssue = profilePicture ? validateFile(profilePicture, IMAGE_ACCEPT) : null;
    if (docIssue || pictureIssue) {
      setDocError(docIssue);
      setPictureError(pictureIssue);
      return;
    }

    setSubmitting(true);
    try {
      // Upload files first, sequentially, then send their URLs with the
      // profile update.
      const doc = await uploadUserFile(verificationDoc);
      const picture = profilePicture ? await uploadUserFile(profilePicture) : null;

      await updateUserProfile({
        institution_name: institutionName.trim(),
        level,
        medium,
        verification_doc: doc.url,
        profile_picture: picture?.url,
      });

      await refreshUser();
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not submit your details. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (alreadyDone) return null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-black/5 bg-white p-8 shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
          <p className="text-xs font-medium uppercase tracking-wide text-olympiad-500">Complete your profile</p>
          <h1 className="mt-1 text-xl font-bold text-olympiad-900">A few more details</h1>
          <p className="mt-1 text-sm text-olympiad-800/70">
            Add your academic details and a document proving you study at your institution. We&apos;ll review
            it shortly — you can explore the site in the meantime.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Input
              id="institution"
              label="Institution name [প্রতিষ্ঠানের নাম]"
              type="text"
              required
              value={institutionName}
              onChange={(e) => setInstitutionName(e.target.value)}
            />

            <Select
              id="level"
              label="Level [শ্রেণি / স্তর]"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>
                Select your level
              </option>
              {LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              id="medium"
              label="Medium [মাধ্যম]"
              required
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
            >
              <option value="" disabled>
                Select your medium
              </option>
              {MEDIUM_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>

            <FileInput
              id="verification-doc"
              label={VERIFICATION_DOC_LABEL}
              hint="Image or PDF, up to 10 MB."
              accept={DOC_ACCEPT}
              required
              disabled={submitting}
              file={verificationDoc}
              onFileChange={pickVerificationDoc}
              error={docError ?? undefined}
            />

            <FileInput
              id="profile-picture"
              label="Profile Picture (Optional) [প্রোফাইল ছবি (ঐচ্ছিক)]"
              hint="A clear photo of your face. Image, up to 10 MB."
              accept={IMAGE_ACCEPT}
              disabled={submitting}
              file={profilePicture}
              onFileChange={pickProfilePicture}
              error={pictureError ?? undefined}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" loading={submitting} className="mt-2 w-full">
              {submitting ? "Submitting…" : "Submit for review"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <ProtectedRoute>
      <OnboardingContent />
    </ProtectedRoute>
  );
}
