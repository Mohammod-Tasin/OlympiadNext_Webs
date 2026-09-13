export interface AcademicOption {
  value: string;
  label: string;
}

// `value` must match the backend's strict enum for the `level` field
// exactly; `label` is what's shown in the dropdown.
export const LEVEL_OPTIONS: AcademicOption[] = [
  { value: "Junior", label: "Junior (Class 6 - 8)" },
  { value: "Secondary", label: "Secondary (Class 9 - 10)" },
  { value: "Higher Secondary", label: "Higher Secondary (Class 11 - 12 / HSC)" },
];

export const MEDIUM_OPTIONS = ["Bangla", "English"];

// Shared between OnboardingClient.tsx and ProfileClient.tsx — exact label
// copy mandated for the verification document field.
export const VERIFICATION_DOC_LABEL =
  "Verification Document [যেকোনো প্রমাণপত্র যা নিশ্চিত করে আপনি ওই প্রতিষ্ঠানের ছাত্র (যেমন: আইডি কার্ড, বেতনের রশিদ, বা রেজাল্ট শিট)]";

export function levelLabel(value?: string): string | undefined {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
