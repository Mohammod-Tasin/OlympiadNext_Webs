import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ProceedBar } from "./ProceedBar";

export const metadata: Metadata = {
  title: "Rules & Terms | OlympiadNext",
  description: "Olympiad rules, terms, and registration guidelines to review before payment.",
};

// PLACEHOLDER COPY. These sections are structural stand-ins only — replace the
// body text with the official, approved rules before launch. Nothing here
// should be treated as a real policy statement.
const SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: "1. Eligibility",
    body: [
      "Placeholder text — replace with the official eligibility criteria. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    ],
  },
  {
    title: "2. Registration and Fees",
    body: [
      "Placeholder text — replace with the official registration and fee policy. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
  {
    title: "3. Exam Format and Conduct",
    body: [
      "Placeholder text — replace with the official exam format and conduct rules. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      "Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
    ],
  },
  {
    title: "4. Code of Conduct",
    body: [
      "Placeholder text — replace with the official code of conduct. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.",
    ],
  },
  {
    title: "5. Results and Disqualification",
    body: [
      "Placeholder text — replace with the official results and disqualification policy. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    ],
  },
  {
    title: "6. Privacy and Data Use",
    body: [
      "Placeholder text — replace with the official privacy and data-use statement. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
    ],
  },
  {
    title: "7. Refund Policy",
    body: [
      "Placeholder text — replace with the official refund policy. Et harum quidem rerum facilis est et expedita distinctio.",
    ],
  },
  {
    title: "8. Acceptance of Terms",
    body: [
      "Placeholder text — replace with the official acceptance clause. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat.",
    ],
  },
];

export default function RulesPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Before you register
        </span>

        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Rules &amp; Terms</h1>
        <p className="mt-2 text-sm text-olympiad-800/70">
          Read through the olympiad rules and registration terms below. When you are ready,
          use the button at the bottom to continue to payment.
        </p>

        <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true">
            <path d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>
            Draft content. The rules and terms shown here are placeholders and are still being
            finalized &mdash; they are not the official competition rules yet.
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-5">
          {SECTIONS.map((section) => (
            <Card key={section.title} className="p-6">
              <h2 className="text-base font-semibold text-olympiad-900">{section.title}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph, i) => (
                  <p key={i} className="text-sm leading-relaxed text-olympiad-800/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <ProceedBar />
    </div>
  );
}
