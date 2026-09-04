"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/useAuth";
import { updateUserProfile } from "@/lib/api/userApi";
import { ApiError } from "@/lib/api/client";
import { LEVEL_OPTIONS, MEDIUM_OPTIONS, levelLabel } from "@/lib/constants/academic";
import { Avatar } from "@/components/ui/Avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

function ProfileField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-olympiad-800/50">{label}</dt>
      <dd className="mt-0.5 text-sm text-olympiad-900">{value || "—"}</dd>
    </div>
  );
}

function ProfileContent() {
  const { user, refreshUser, logout } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(user?.full_name ?? "");
  const [institutionName, setInstitutionName] = useState(user?.institution_name ?? "");
  const [level, setLevel] = useState(user?.level ?? "");
  const [medium, setMedium] = useState(user?.medium ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function startEditing() {
    setFullName(user?.full_name ?? "");
    setInstitutionName(user?.institution_name ?? "");
    setLevel(user?.level ?? "");
    setMedium(user?.medium ?? "");
    setError(null);
    setEditing(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await updateUserProfile({
        full_name: fullName.trim(),
        institution_name: institutionName.trim(),
        level,
        medium,
      });
      await refreshUser();
      setEditing(false);
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
          <p className="text-sm text-olympiad-800/70">{user?.email}</p>
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

      <Button variant="primary" size="lg" onClick={handleLogout} className="w-full">
        Logout
      </Button>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
