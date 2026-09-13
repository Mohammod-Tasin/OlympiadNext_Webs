import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us | OlympiadNext",
  description: "Shikhor's story, what we do, and the values behind our online olympiads.",
};

/** English paragraph followed by its Bangla translation, the same stacked
 * bilingual pattern used on HowToParticipate.tsx's step copy. */
function Bilingual({ en, bn }: { en: string; bn: string }) {
  return (
    <>
      <p className="text-sm leading-relaxed text-text-muted">{en}</p>
      <p lang="bn" className="mt-2 text-sm leading-relaxed text-text-muted">
        {bn}
      </p>
    </>
  );
}

export default function AboutPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-olympiad-900 sm:text-3xl">About Us / আমাদের সম্পর্কে</h1>

        <Card className="mt-8 divide-y divide-gray-100">
          <div className="p-6">
            <h2 className="text-base font-semibold text-olympiad-900">Our Story / আমাদের গল্প</h2>
            <div className="mt-3">
              <Bilingual
                en="Shikhor began with a simple observation: talented students across Bangladesh — in cities and small towns alike — often don't get the platform to test themselves against the best, simply because of where they live or what resources are available to them. We built Shikhor to change that."
                bn="শিখরের শুরু একটা সাধারণ পর্যবেক্ষণ থেকে — বাংলাদেশের শহর কিংবা মফস্বলের অনেক মেধাবী শিক্ষার্থীই নিজেদের সেরাদের সাথে যাচাই করার সুযোগ পায় না, শুধু তারা কোথায় থাকে বা তাদের কাছে কী সুযোগ-সুবিধা আছে তার কারণে। আমরা শিখর তৈরি করেছি এই ব্যবধানটা কমানোর জন্য।"
              />
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-base font-semibold text-olympiad-900">What We Do / আমরা যা করি</h2>
            <div className="mt-3">
              <Bilingual
                en="We run competitive, fully online olympiads that any student can access from a phone or a shared computer — no travel, no gatekeeping. Every exam is structured in clear stages, so a student's progress reflects what they've actually demonstrated, round by round."
                bn="আমরা সম্পূর্ণ অনলাইন-ভিত্তিক প্রতিযোগিতামূলক অলিম্পিয়াড আয়োজন করি, যেখানে যেকোনো শিক্ষার্থী একটা ফোন বা শেয়ার করা কম্পিউটার দিয়েই অংশ নিতে পারে — কোনো যাতায়াতের দরকার নেই, কোনো বাধা নেই। প্রতিটা পরীক্ষা স্পষ্ট ধাপে ভাগ করা, যাতে একজন শিক্ষার্থীর অগ্রগতি সত্যিকার অর্থেই তার নিজের যোগ্যতা প্রতিফলিত করে, রাউন্ড অনুযায়ী।"
              />
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-base font-semibold text-olympiad-900">Our Values / আমাদের মূল্যবোধ</h2>
            <ul className="mt-3 flex flex-col gap-4">
              <li>
                <Bilingual
                  en="Accessibility — a good exam shouldn't depend on your postal code."
                  bn="সহজলভ্যতা — একটা ভালো পরীক্ষা কারো পোস্টাল কোডের উপর নির্ভর করা উচিত না।"
                />
              </li>
              <li>
                <Bilingual
                  en="Fairness — every registration, every payment, every result goes through the same verification process, for everyone."
                  bn="নিরপেক্ষতা — প্রতিটা রেজিস্ট্রেশন, প্রতিটা পেমেন্ট, প্রতিটা ফলাফল সবার জন্য একই যাচাই প্রক্রিয়ার মধ্য দিয়ে যায়।"
                />
              </li>
              <li>
                <Bilingual
                  en="Growth over gatekeeping — we'd rather build students up than filter them out."
                  bn="বাধা না দিয়ে বেড়ে ওঠার সুযোগ — আমরা শিক্ষার্থীদের ফিল্টার করার চেয়ে গড়ে তুলতে বেশি আগ্রহী।"
                />
              </li>
            </ul>
          </div>

          <div className="p-6">
            <h2 className="text-base font-semibold text-olympiad-900">Where We&apos;re Headed / আমরা যেদিকে এগোচ্ছি</h2>
            <div className="mt-3">
              <Bilingual
                en="Shikhor is early — this is our first cohort. We're building this platform in the open, learning from every batch of students who register, and improving with every event. If you're a student, a parent, or a school reading this: thank you for trusting us this early."
                bn="শিখর এখনো একদম নতুন — এটা আমাদের প্রথম ব্যাচ। আমরা প্রকাশ্যেই এই প্ল্যাটফর্মটা গড়ে তুলছি, প্রতিটা নতুন শিক্ষার্থী-দলের কাছ থেকে শিখছি, আর প্রতিটা ইভেন্টের সাথে আরও ভালো হচ্ছি। তুমি যদি একজন শিক্ষার্থী, অভিভাবক, বা স্কুল হয়ে এটা পড়ছ — আমাদের এত তাড়াতাড়ি বিশ্বাস করার জন্য ধন্যবাদ।"
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
