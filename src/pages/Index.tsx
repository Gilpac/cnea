import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Entities from "@/components/Entities";
import ProgramsCarousel from "@/components/ProgramsCarousel";
import Benefits from "@/components/Benefits";
import Resources from "@/components/Resources";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <About />
      <Entities />
      <ProgramsCarousel />
      <Benefits />
      <Resources />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
