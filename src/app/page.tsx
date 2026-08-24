"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
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
    <>
      <HeroSection />
      <StatsSection />
    </>
  );
}
