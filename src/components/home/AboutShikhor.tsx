import { Card } from "@/components/ui/Card";

/** Verbatim copy — the English and Bengali descriptions are kept in sync
 * and must not be paraphrased. */
const ABOUT_EN =
  "Shikhor is a premier academic platform dedicated to discovering and nurturing young talents across the nation. Through competitive olympiads and interactive learning, we aim to bridge the gap between dreams and reality, empowering students to reach their highest potential.";

const ABOUT_BN =
  "শিখর হলো দেশব্যাপী তরুণ প্রতিভাদের খুঁজে বের করা এবং তাদের মেধার বিকাশে নিবেদিত একটি শীর্ষস্থানীয় একাডেমিক প্ল্যাটফর্ম। প্রতিযোগিতামূলক অলিম্পিয়াড এবং আনন্দদায়ক শিক্ষার মাধ্যমে আমরা স্বপ্ন ও বাস্তবতার মাঝে সেতুবন্ধন তৈরি করতে চাই, যাতে শিক্ষার্থীরা তাদের সর্বোচ্চ সম্ভাবনার শিখরে পৌঁছাতে পারে।";

export function AboutShikhor() {
  return (
    <section id="about" className="scroll-mt-16 bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-olympiad-900 sm:text-3xl">
            About Shikhor
            <span className="mx-2 font-normal text-olympiad-800/30">|</span>
            শিখর সম্পর্কে
          </h2>
          <span
            className="mx-auto mt-4 block h-1 w-16 rounded-full bg-medal-500"
            aria-hidden="true"
          />
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <Card className="p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-olympiad-500">
              English
            </h3>
            <p className="mt-3 text-base leading-relaxed text-olympiad-800/80 sm:text-lg">
              {ABOUT_EN}
            </p>
          </Card>

          <Card className="p-6 sm:p-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-olympiad-500">
              বাংলা
            </h3>
            <p
              lang="bn"
              className="mt-3 text-base leading-loose text-olympiad-800/80 sm:text-lg"
            >
              {ABOUT_BN}
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
