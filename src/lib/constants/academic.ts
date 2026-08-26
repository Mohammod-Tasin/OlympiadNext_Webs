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

export function levelLabel(value?: string): string | undefined {
  return LEVEL_OPTIONS.find((option) => option.value === value)?.label ?? value;
}
