const steps = [
  {
    number: "1",
    title: "Search & compare",
    description: "Filter by category, location, dates and price.",
  },
  {
    number: "2",
    title: "Book securely",
    description: "Pay through Stripe. Funds release after pickup.",
  },
  {
    number: "3",
    title: "Pick up & build",
    description: "Collect or get it delivered. Return when done.",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="border-y border-background/10 bg-background/5"
    >
      <div className="mx-auto w-full max-w-5xl px-4 pt-16 pb-14 sm:px-6 lg:px-8">
        <h2
          id="how-it-works-heading"
          className="text-section font-bold tracking-tight"
        >
          How it works
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex min-h-52 flex-col rounded-xl border border-background/10 bg-background/5 p-5"
            >
              <span className="text-3xl font-bold text-brand">
                {step.number}
              </span>
              <h3 className="mt-4 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-background/60">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
