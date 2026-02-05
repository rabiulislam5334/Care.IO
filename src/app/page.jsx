import Hero from "@/components/Hero";
 import FeaturedServices from "@/components/FeaturedServices";
import WhyChooseUs from "@/components/WhyChooseUs";
import Stats from "@/components/Stats";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CallToAction";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
    <FeaturedServices/>
      <WhyChooseUs />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </div>
  );
}
