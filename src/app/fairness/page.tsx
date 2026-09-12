import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Fairness & Integrity | OlympiadNext",
  description:
    "How OlympiadNext verifies accounts and registrations, and controls exam round access, to keep competition fair.",
};

const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "Account Verification / অ্যাকাউন্ট ভেরিফিকেশন",
    body: "Every account is verified in two layers: email OTP confirmation at signup, and a manual document review (ID card, salary slip, or result sheet) before the account is marked verified. / প্রতিটা অ্যাকাউন্ট দুই ধাপে ভেরিফাই করা হয়: সাইনআপের সময় ইমেইল OTP নিশ্চিতকরণ, এবং একটা ডকুমেন্ট (ID card, salary slip, বা result sheet) ম্যানুয়ালি রিভিউ করার পর অ্যাকাউন্ট ভেরিফায়েড হিসেবে চিহ্নিত হয়।",
  },
  {
    title: "Registration Integrity / রেজিস্ট্রেশন সততা",
    body: "Each student can register only once per event. Every payment transaction ID is checked and can be used only once — the same transaction cannot be reused across registrations. All registrations are held pending until an admin manually reviews and matches the payment before approval. / একজন শিক্ষার্থী একটা ইভেন্টে শুধু একবারই রেজিস্ট্রেশন করতে পারবে। প্রতিটা পেমেন্ট transaction ID যাচাই করা হয় এবং একবারই ব্যবহারযোগ্য। সব রেজিস্ট্রেশন pending অবস্থায় থাকে যতক্ষণ না একজন অ্যাডমিন ম্যানুয়ালি পেমেন্ট মিলিয়ে অনুমোদন দেন।",
  },
  {
    title: "Device Signal / ডিভাইস সিগন্যাল",
    body: "A device signal is collected during account activity as part of our security measures. / সিকিউরিটি ব্যবস্থার অংশ হিসেবে অ্যাকাউন্ট কার্যকলাপের সময় একটা ডিভাইস সিগন্যাল সংগ্রহ করা হয়।",
  },
  {
    title: "Round Access Control / রাউন্ড এক্সেস কন্ট্রোল",
    body: "Access to each exam round is determined server-side, based on your registration status and your results in the previous round — this cannot be bypassed from the browser. / প্রতিটা এক্সাম রাউন্ডে প্রবেশাধিকার সার্ভার-সাইডে নির্ধারিত হয়, আপনার রেজিস্ট্রেশন স্ট্যাটাস এবং আগের রাউন্ডের ফলাফলের ভিত্তিতে — এটা ব্রাউজার থেকে বাইপাস করা সম্ভব না।",
  },
];

export default function FairnessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="text-2xl font-bold text-olympiad-900 sm:text-3xl">
          Fairness &amp; Integrity / ন্যায্যতা ও সততা
        </h1>

        <Card className="mt-8 divide-y divide-gray-100">
          {SECTIONS.map((section) => (
            <div key={section.title} className="p-6">
              <h2 className="text-base font-semibold text-olympiad-900">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">{section.body}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
