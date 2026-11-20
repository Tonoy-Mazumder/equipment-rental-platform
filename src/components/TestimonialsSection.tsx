import Link from "next/link";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Rafiq Ahmed",
    role: "Site manager",
    quote: "Booked an excavator in ten minutes. The owner delivered it the next morning.",
  },
  {
    name: "Nusrat Jahan",
    role: "Contractor",
    quote: "Prices were clearer than any local dealer. Saved us a week of procurement.",
  },
  {
    name: "Imran Hossain",
    role: "Machine owner",
    quote: "My idle dozer now earns more than my loan payment. Payouts are on time.",
  },
];

function TestimonialCards() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-16">
      <h2 className="text-3xl font-extrabold tracking-tight text-[#F7F4EE]">
        What customers say
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <figure
            key={t.name}
            className="rounded-2xl border border-[#2f3639] bg-[#1b2124] p-5"
          >
            <blockquote className="text-[15px] leading-relaxed text-[#F7F4EE]">
              “{t.quote}”
            </blockquote>
            <figcaption className="mt-5">
              <p className="font-semibold text-white">{t.name}</p>
              <p className="text-[13px] text-[#9a9c96]">{t.role}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function OwnerCta() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 pb-16">
      <div className="flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-[#F28C28] p-8 text-[#111719] sm:p-12">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            Got equipment sitting idle?
          </h2>
          <p className="mt-1.5">List it free and start earning in days.</p>
        </div>
        <Link
          href="/register"
          className="rounded-xl bg-[#111719] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Become an owner
        </Link>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <div className="bg-[#111719]">
      <TestimonialCards />
      <OwnerCta />
    </div>
  );
}

export default Testimonials;