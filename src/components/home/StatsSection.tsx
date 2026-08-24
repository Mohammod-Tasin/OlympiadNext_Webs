import { Card, CardContent } from "@/components/ui/Card";

const STATS = [
  { value: "10,000+", label: "Participants" },
  { value: "500+", label: "Schools" },
  { value: "50+", label: "Districts" },
];

export function StatsSection() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 md:grid-cols-3">
        {STATS.map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="py-8">
              <p className="text-4xl font-bold text-olympiad-500">{stat.value}</p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wide text-olympiad-800">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
