import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ProceedBar } from "./ProceedBar";

export const metadata: Metadata = {
  title: "Exam Terms | OlympiadNext",
  description: "Anti-cheating and exam-conduct terms to review before completing registration payment.",
};

const SECTIONS: Array<{ title: string; body: React.ReactNode }> = [
  {
    title: "1. Exam Conduct / পরীক্ষার আচরণবিধি",
    body: (
      <>
        <p className="text-sm leading-relaxed text-text-muted">
          This is a fully online, individually-taken examination. To keep results fair for
          everyone, the following rules apply <strong className="font-semibold text-olympiad-900">strictly</strong>.
        </p>
        <p className="text-sm leading-relaxed text-text-muted">
          এটি একটি সম্পূর্ণ অনলাইন, একক (individual) পরীক্ষা। সবার জন্য ফলাফল ন্যায্য রাখতে নিচের
          নিয়মগুলো <strong className="font-semibold text-olympiad-900">কঠোরভাবে</strong> মেনে চলতে হবে।
        </p>
      </>
    ),
  },
  {
    title: "2. Prohibited Actions / নিষিদ্ধ কার্যক্রম",
    body: (
      <>
        <p className="text-sm leading-relaxed text-text-muted">
          During the exam, the following are <strong className="font-semibold text-olympiad-900">strictly prohibited</strong>:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-muted">
          <li>Taking help from another person, book, or website</li>
          <li>Copying or sharing questions/answers with anyone</li>
          <li>Switching browser tabs or leaving the exam window</li>
          <li>Using a second device to search for answers</li>
        </ul>
        <p className="text-sm leading-relaxed text-text-muted">
          পরীক্ষার সময় নিচের কাজগুলো <strong className="font-semibold text-olympiad-900">সম্পূর্ণভাবে নিষিদ্ধ</strong>:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-text-muted">
          <li>অন্য কারো, বই, বা ওয়েবসাইটের সাহায্য নেওয়া</li>
          <li>প্রশ্ন বা উত্তর কপি করা বা কারো সাথে শেয়ার করা</li>
          <li>ব্রাউজার ট্যাব পরিবর্তন করা বা exam window থেকে বের হওয়া</li>
          <li>উত্তর খোঁজার জন্য দ্বিতীয় কোনো ডিভাইস ব্যবহার করা</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Disqualification / ডিসকোয়ালিফিকেশন",
    body: (
      <>
        <p className="text-sm leading-relaxed text-text-muted">
          If any form of cheating, tab-switching, or unfair means is detected, the student will
          be <strong className="font-semibold text-olympiad-900">immediately disqualified</strong> from the event
          &mdash; no exceptions, regardless of score.
        </p>
        <p className="text-sm leading-relaxed text-text-muted">
          যদি কোনো ধরনের নকল, ট্যাব সুইচিং, বা অসদুপায় ধরা পড়ে, তাহলে সেই শিক্ষার্থীকে{" "}
          <strong className="font-semibold text-olympiad-900">সাথে সাথে ডিসকোয়ালিফাই করা হবে</strong> &mdash; স্কোর যত
          ভালোই হোক না কেন, কোনো ব্যতিক্রম নেই।
        </p>
      </>
    ),
  },
  {
    title: "4. Technical Notice / টেকনিক্যাল নোটিশ",
    body: (
      <>
        <p className="text-sm leading-relaxed text-text-muted">
          Exam dates or times may occasionally change due to unforeseen technical or
          administrative reasons. Any such change will be communicated through the Notice Board
          and via email/SMS before the exam.
        </p>
        <p className="text-sm leading-relaxed text-text-muted">
          অপ্রত্যাশিত কারিগরি বা প্রশাসনিক কারণে পরীক্ষার তারিখ বা সময় পরিবর্তন হতে পারে। এমন কোনো
          পরিবর্তন হলে তা Notice Board এবং ইমেইল/SMS-এর মাধ্যমে পরীক্ষার আগেই জানানো হবে।
        </p>
      </>
    ),
  },
  {
    title: "5. Fair-Play Commitment / সততার প্রতিশ্রুতি",
    body: (
      <>
        <p className="text-sm leading-relaxed text-text-muted">
          By registering for this exam, you agree to take it honestly, on your own, without
          outside help. We trust our students &mdash; and we protect that trust by enforcing
          these rules equally for everyone.
        </p>
        <p className="text-sm leading-relaxed text-text-muted">
          এই পরীক্ষায় রেজিস্ট্রেশন করার মাধ্যমে আপনি সম্মত হচ্ছেন যে আপনি সৎভাবে, নিজে থেকে, কোনো
          বাইরের সাহায্য ছাড়া পরীক্ষা দেবেন। আমরা আমাদের শিক্ষার্থীদের বিশ্বাস করি &mdash; এবং সবার
          জন্য সমানভাবে এই নিয়ম প্রয়োগ করে সেই বিশ্বাস রক্ষা করি।
        </p>
      </>
    ),
  },
];

export default function RegisterTermsPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-olympiad-500/20 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-olympiad-500">
          Before you register
        </span>

        <h1 className="mt-3 text-2xl font-bold text-olympiad-900 sm:text-3xl">Exam Terms</h1>
        <p className="mt-2 text-sm text-text-muted">
          Read through the exam-conduct terms below. When you are ready, use the button at the
          bottom to continue to payment.
        </p>

        <Card className="mt-8 divide-y divide-gray-100">
          {SECTIONS.map((section) => (
            <div key={section.title} className="p-6">
              <h2 className="text-base font-semibold text-olympiad-900">{section.title}</h2>
              <div className="mt-3 flex flex-col gap-3">{section.body}</div>
            </div>
          ))}
        </Card>
      </div>

      <ProceedBar />
    </div>
  );
}
