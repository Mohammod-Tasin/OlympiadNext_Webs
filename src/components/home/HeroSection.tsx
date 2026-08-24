"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-b from-olympiad-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
        <h1 className="text-4xl font-extrabold tracking-tight text-olympiad-900 sm:text-5xl md:text-6xl">
          Welcome to OlympiadNext
        </h1>
        <p className="max-w-2xl text-lg text-olympiad-800/80">
          The home for competitive academic olympiads — register your school, track results, and compete with
          the brightest students across the country.
        </p>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <Button variant="primary" size="lg" onClick={() => router.push("/register")}>
            Register Now
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push("/guidelines")}>
            View Guidelines
          </Button>
        </div>
      </div>
    </section>
  );
}
