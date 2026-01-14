import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSlider } from '@/components/landing/StatsSlider';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { EquipmentShowcase } from '@/components/landing/EquipmentShowcase';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { TrustBadges } from '@/components/landing/TrustBadges';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { CTASection } from '@/components/landing/CTASection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSlider />
        <FeaturesSection />
        <EquipmentShowcase />
        <HowItWorksSection />
        <CategoriesSection />
        <TrustBadges />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;