import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <ServicesSection />
      <WhyChooseUs />
    </div>
  );
}
