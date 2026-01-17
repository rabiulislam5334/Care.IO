import Hero from "@/components/Hero";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <ServicesSection />
      <WhyChooseUs />
      <HowItWorks />
    </div>
  );
}
