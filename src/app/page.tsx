import { FeaturedEquipment } from "@/components/featured-equipment";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { PopularCategories } from "@/components/popular-categories";
import { Testimonials } from "@/components/TestimonialsSection";
import { WhyChooseRentPro } from "@/components/why-choose-rentpro";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-foreground text-background">
      <Hero />
      <PopularCategories />
      <FeaturedEquipment />
      <HowItWorks />
      <WhyChooseRentPro />
      <Testimonials></Testimonials>
    </main>
  );
}
