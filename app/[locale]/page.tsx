import Navigation from '@/components/sections/navigation';
import HeroSection from '@/components/sections/hero';
import PhilosophySection from '@/components/sections/philosophy';
import ServicesSection from '@/components/sections/services';
import ProcessSection from '@/components/sections/process';
import AboutSection from '@/components/sections/about';
import ContactSection from '@/components/sections/contact';
import Footer from '@/components/sections/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <PhilosophySection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
