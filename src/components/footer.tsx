import Link from "next/link";

type FooterLink = {
  label: string;
  href: string;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

const footerSections: FooterSection[] = [
  {
    title: "Marketplace",
    links: [
      { label: "Excavators", href: "/equipment?category=excavators" },
      { label: "Lifts", href: "/equipment?category=lifts" },
      { label: "Generators", href: "/equipment?category=generators" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help centre", href: "/help" },
      { label: "Insurance", href: "/insurance" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
          <div className="lg:w-[38%] lg:shrink-0">
            <Link
              href="/"
              className="inline-block font-heading text-2xl leading-none font-extrabold tracking-tight"
            >
              <span className="block">Rent</span>
              <span className="block">Pro</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-relaxed text-background/70">
              The marketplace for renting heavy equipment from verified owners.
            </p>

            <p className="mt-12 text-sm text-background/60">
              © 2026 RentPro. All rights reserved.
            </p>
          </div>

          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
            {footerSections.map((section) => (
              <nav key={section.title} aria-label={section.title}>
                <h2 className="text-base font-semibold">{section.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-background/70 transition-colors hover:text-background"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
