import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SpaceSelector } from "@/components/landing/SpaceSelector";
import { WhatsIncluded } from "@/components/landing/WhatsIncluded";
import { Portfolio } from "@/components/landing/Portfolio";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <HowItWorks />
        <SpaceSelector />
        <WhatsIncluded />
        <Portfolio />
        <FAQ />
      </main>
      <Footer />
    </>
  );
};

export default Index;
