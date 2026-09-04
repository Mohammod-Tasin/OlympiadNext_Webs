import { apiFetch } from "./client";

/** URL of a stored upload, as returned by `POST /api/user/upload-file`. */
export interface UploadedFile {
  url: string;
}

// Uploads can be large and slow relative to a JSON request, so they get a
// wider timeout than the client default.
const UPLOAD_TIMEOUT_MS = 60_000;

/**
 * Uploads a single file (verification document or profile picture) as
 * `multipart/form-data` and returns its stored URL. The access token and
 * device-fingerprint headers are attached by the API client; the browser
 * sets the multipart `Content-Type` boundary itself.
 */
export async function uploadUserFile(file: File): Promise<UploadedFile> {
  const form = new FormData();
  form.append("file", file);

  return apiFetch<UploadedFile>("/api/user/upload-file", {
    method: "POST",
    body: form,
    timeoutMs: UPLOAD_TIMEOUT_MS,
  });
}

export interface UserProfileUpdate {
  full_name?: string;
  institution_name?: string;
  level?: string;
  medium?: string;
  /** URL returned by `uploadUserFile`. Sent during onboarding; omitted on
   * later profile edits that only touch the academic fields. */
  verification_doc?: string;
  /** URL returned by `uploadUserFile` — optional. */
  profile_picture?: string;
}

/**
 * Updates the user's profile via `PUT /api/user/profile`. Used both by
 * onboarding (with the verification document) and by the profile settings
 * page (academic fields only). On first submission the account moves to
 * `pending` review: the user browses freely, but exam entry stays gated
 * until an admin marks them `verified`.
 */
export function updateUserProfile(data: UserProfileUpdate) {
  return apiFetch<{ message: string }>("/api/user/profile", {
    method: "PUT",
    body: data,
  });
}
