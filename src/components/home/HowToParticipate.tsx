/** Verbatim bilingual copy — do not paraphrase. Titles were dropped: each
 * step is now the English sentence with its Bengali translation beneath. */
const STEPS: Array<{ en: string; bn: string }> = [
  {
    en: "Register with your school details and required documents.",
    bn: "আপনার স্কুলের তথ্য ও প্রয়োজনীয় কাগজপত্র দিয়ে নিবন্ধন করুন।",
  },
  {
    en: "Complete your registration by making the payment.",
    bn: "পেমেন্ট সম্পন্ন করে আপনার নিবন্ধন নিশ্চিত করুন।",
  },
  {
    en: "Once your payment is verified, you'll be notified by email or SMS — download your admit card from your dashboard.",
    bn: "পেমেন্ট যাচাই হলে ইমেইল বা এসএমএসের মাধ্যমে জানানো হবে। আপনার ড্যাশবোর্ড থেকে অ্যাডমিট কার্ড ডাউনলোড করুন।",
  },
  {
    en: "Practice with a timed mock test to prepare for the real exam.",
    bn: "মূল পরীক্ষার প্রস্তুতির জন্য সময়-নির্ধারিত মক টেস্ট অনুশীলন করুন।",
  },
  {
    en: "Sit for the main olympiad and compete for top honors.",
    bn: "মূল অলিম্পিয়াডে অংশগ্রহণ করে সেরাদের প্রতিযোগিতায় অংশ নিন।",
  },
];

export function HowToParticipate() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-olympiad-900 sm:text-3xl">How to Participate</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex flex-col rounded-xl bg-olympiad-50 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-olympiad-500 text-sm font-bold text-white">
                {i + 1}
              </div>
              <p className="mt-4 text-sm font-medium text-olympiad-900">{step.en}</p>
              <p lang="bn" className="mt-2 text-sm leading-relaxed text-olympiad-800/70">
                {step.bn}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
