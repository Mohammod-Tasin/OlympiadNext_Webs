import { HeroEventBanner } from "@/components/home/HeroEventBanner";
import { StatsSection } from "@/components/home/StatsSection";
import { NoticeBoard } from "@/components/home/NoticeBoard";
import { HowToParticipate } from "@/components/home/HowToParticipate";
import { Timeline } from "@/components/home/Timeline";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <HeroEventBanner />
      <StatsSection />
      <NoticeBoard />
      <HowToParticipate />
      <Timeline />
    </div>
  );
}
