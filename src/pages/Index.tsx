import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { Testimonials } from '@/components/landing/Testimonials';
import { UniversityGuidance } from '@/components/landing/UniversityGuidance';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UniversityGuidance />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
