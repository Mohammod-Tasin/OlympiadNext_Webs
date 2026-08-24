const STEPS = [
  { number: 1, title: "Register", description: "Sign up your school or yourself with a few basic details." },
  { number: 2, title: "Get Admit Card", description: "Download your admit card once registration is confirmed." },
  { number: 3, title: "Mock Test", description: "Practice with a timed mock test to get familiar with the format." },
  { number: 4, title: "Final Olympiad", description: "Sit for the main olympiad and compete for top honors." },
];

export function HowToParticipate() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-2xl font-bold text-olympiad-900 sm:text-3xl">How to Participate</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {STEPS.map((step) => (
            <div key={step.number} className="rounded-xl bg-olympiad-50 p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-olympiad-500 text-sm font-bold text-white">
                {step.number}
              </div>
              <h3 className="mt-4 text-base font-semibold text-olympiad-900">{step.title}</h3>
              <p className="mt-2 text-sm text-olympiad-800/80">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
