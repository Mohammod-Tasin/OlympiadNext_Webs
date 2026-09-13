"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { updateUserProfile, uploadUserFile } from "@/lib/api/userApi";
import { ApiError } from "@/lib/api/client";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS, VERIFICATION_DOC_LABEL, levelLabel } from "@/lib/constants/academic";
import { DOC_ACCEPT, validateFile } from "@/lib/utils/fileValidation";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FileInput } from "@/components/ui/FileInput";
import { Button } from "@/components/ui/Button";
import { NotificationPreferences } from "@/components/profile/NotificationPreferences";

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm text-olympiad-900">{value || "—"}</dd>
    </div>
  );
}

function ProfileContent() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [institutionName, setInstitutionName] = useState(user?.institution_name ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [medium, setMedium] = useState(user?.medium ?? "");
  const [verificationDoc, setVerificationDoc] = useState<File | null>(null);
  const [docError, setDocError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Changing level or institution invalidates the admin's existing review
  // of the student, so a fresh document is required alongside those two
  // fields specifically — full_name/medium never need one.
  const levelOrInstitutionChanged =
    level !== (user?.level ?? "") || institutionName.trim() !== (user?.institution_name ?? "");

  function startEditing() {
    setFullName(user?.full_name ?? "");
    setInstitutionName(user?.institution_name ?? "");
    setLevel(user?.level ?? "");
    setMedium(user?.medium ?? "");
    setVerificationDoc(null);
    setDocError(null);
    setError(null);
    setEditing(true);
  }

  function pickVerificationDoc(file: File | null) {
    setVerificationDoc(file);
    setDocError(file ? validateFile(file, DOC_ACCEPT) : null);
  }

  // Lets Quick Actions' "Edit Profile" button link straight into edit mode
  // via /profile?edit=1, instead of always landing in read mode.
  useEffect(() => {
    if (searchParams.get("edit") === "1") startEditing();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (levelOrInstitutionChanged && !verificationDoc) {
      setDocError("Changing your level or school requires a new verification document.");
      return;
    }
    const docIssue = verificationDoc ? validateFile(verificationDoc, DOC_ACCEPT) : null;
    if (docIssue) {
      setDocError(docIssue);
      return;
    }

    setSubmitting(true);
    try {
      const doc = verificationDoc ? await uploadUserFile(verificationDoc) : null;

      await updateUserProfile({
        full_name: fullName.trim(),
        institution_name: institutionName.trim(),
        level,
        medium,
        // Omitted (not an empty string) when no new file was picked — the
        // backend keeps the stored document and verification status as-is.
        verification_doc: doc?.url,
      });
      await refreshUser();
      setEditing(false);
      setVerificationDoc(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not update your profile");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar name={user?.full_name || user?.email} size="lg" />
        <div>
          <h1 className="text-2xl font-bold text-olympiad-900">{user?.full_name || "Your Profile"}</h1>
          <p className="text-sm text-text-muted">{user?.email}</p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-olympiad-800">
            {editing ? "Edit details" : "Your details"}
          </h2>
          {!editing && (
            <Button variant="outline" size="sm" onClick={startEditing}>
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {editing ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                id="full-name"
                label="Full name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
              <Input
                id="institution"
                label="Institution name"
                type="text"
                required
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
              />
              <Select id="level" label="Level" required value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="" disabled>
                  Select your level
                </option>
                {LEVEL_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Select id="medium" label="Medium" required value={medium} onChange={(e) => setMedium(e.target.value)}>
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
                hint={
                  levelOrInstitutionChanged
                    ? "Required — you changed your level or school. Image or PDF, up to 10 MB."
                    : "Optional — only needed if you change your level or school. Image or PDF, up to 10 MB."
                }
                accept={DOC_ACCEPT}
                required={levelOrInstitutionChanged}
                disabled={submitting}
                file={verificationDoc}
                onFileChange={pickVerificationDoc}
                error={docError ?? undefined}
              />

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 flex gap-3">
                <Button type="submit" loading={submitting} className="flex-1">
                  Save changes
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={submitting}
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ProfileField label="Full name" value={user?.full_name} />
              <ProfileField label="Email" value={user?.email} />
              <ProfileField label="Institution" value={user?.institution_name} />
              <ProfileField label="Level" value={levelLabel(user?.level)} />
              <ProfileField label="Medium" value={user?.medium} />
            </dl>
          )}
        </CardContent>
      </Card>

      <NotificationPreferences />

      <Button variant="primary" size="lg" onClick={handleLogout} className="w-full">
        Logout
      </Button>
    </div>
  );
}

export function ProfileClient() {
  return (
    <ProtectedRoute>
      <Suspense fallback={null}>
        <ProfileContent />
      </Suspense>
    </ProtectedRoute>
  );
}
