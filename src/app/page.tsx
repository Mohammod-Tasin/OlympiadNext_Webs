"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";
import { useAuth } from "@/lib/auth/useAuth";

export default function HomePage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <HeroSection />
      <StatsSection />
      <NoticeBoard />
      <HowToParticipate />
      <Timeline />
    </div>
  );
}
