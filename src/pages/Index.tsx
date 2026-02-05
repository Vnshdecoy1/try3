import { lazy, Suspense, useEffect } from 'react';
import { Navigation } from '@/components/layout/Navigation';
import { HeroSection } from '@/components/sections/HeroSection';

// Lazy load non-critical sections for performance
const WhatIGetSection = lazy(() => import('@/components/sections/WhatIGetSection').then(m => ({ default: m.WhatIGetSection })));
const ProfitsSection = lazy(() => import('@/components/sections/ProfitsSection').then(m => ({ default: m.ProfitsSection })));
const JourneysSection = lazy(() => import('@/components/sections/JourneysSection').then(m => ({ default: m.JourneysSection })));
const ToolsSection = lazy(() => import('@/components/sections/ToolsSection').then(m => ({ default: m.ToolsSection })));
const FAQSection = lazy(() => import('@/components/sections/FAQSection').then(m => ({ default: m.FAQSection })));
const FooterSection = lazy(() => import('@/components/sections/FooterSection').then(m => ({ default: m.FooterSection })));

// Simple loading fallback
const SectionLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-loq-purple border-t-transparent rounded-full animate-spin" />
  </div>
);

const Index = () => {
  useEffect(() => {
    console.log('Index page mounted');
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {console.log('Rendering Index page')}
      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main>
        {/* Hero - Always loaded immediately */}
        <HeroSection />

        {/* Lazy-loaded sections */}
        <Suspense fallback={<SectionLoader />}>
          <WhatIGetSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ProfitsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <JourneysSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <ToolsSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FAQSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <FooterSection />
        </Suspense>
      </main>
    </div>
  );
};

export default Index;
