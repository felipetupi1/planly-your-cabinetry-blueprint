import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProjectSamples } from "@/components/landing/ProjectSamples";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SpaceSelector } from "@/components/landing/SpaceSelector";
import { WhatsIncluded } from "@/components/landing/WhatsIncluded";
import { HowToMeasure } from "@/components/landing/HowToMeasure";
import { Portfolio } from "@/components/landing/Portfolio";
import { Reviews } from "@/components/landing/Reviews";
import { FounderSection } from "@/components/landing/FounderSection";
import { FAQ } from "@/components/landing/FAQ";
import { Contact } from "@/components/landing/Contact";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <ProjectSamples />
        <HowItWorks />
        <SpaceSelector />
        <WhatsIncluded />
        <HowToMeasure />
        <Portfolio />
        <Reviews />
        <FounderSection />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Index;
