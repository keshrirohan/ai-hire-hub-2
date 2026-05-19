'use client';

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { CtaSection } from '@/components/landing/CtaSection';
import { Footer } from '@/components/landing/Footer';

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://airehub.com/#organization',
      name: 'AI Hire Hub',
      url: 'https://airehub.com',
      description: 'AI-powered freelancer marketplace that uses Groq AI to plan projects, match talent, and manage milestone-based payments.',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'AI Hire Hub',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: [
        { '@type': 'Offer', name: 'Starter', price: '0', priceCurrency: 'INR' },
        { '@type': 'Offer', name: 'Professional', price: '999', priceCurrency: 'INR' },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '15000',
        bestRating: '5',
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen hero-gradient overflow-hidden">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <PricingSection />
          <CtaSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
