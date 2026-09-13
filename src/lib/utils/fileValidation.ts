// Shared between OnboardingClient.tsx and ProfileClient.tsx, which both let
// a student pick a verification document (and onboarding also a profile
// picture) via the same FileInput component.
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const DOC_ACCEPT = "image/png,image/jpeg,image/webp,image/heic,application/pdf";
export const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp,image/heic";

/** Validates a picked file against an `accept` list and the shared 10 MB
 * cap, returning a user-facing message or null when the file is fine. */
export function validateFile(file: File, accept: string): string | null {
  const allowed = accept.split(",");
  const ok = allowed.some((type) =>
    type.endsWith("/*") ? file.type.startsWith(type.slice(0, -1)) : file.type === type,
  );
  if (!ok) return "That file type isn't supported. Use an image or a PDF.";
  if (file.size > MAX_FILE_BYTES) return "File is too large — the limit is 10 MB.";
  return null;
}
