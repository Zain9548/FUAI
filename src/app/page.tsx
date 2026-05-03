// app/page.tsx
// Landing Page — Hero, Features, Tools Showcase, Pricing, CTA

import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ToolsSection } from '@/components/landing/ToolsSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface overflow-x-hidden">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-500/5 blur-[100px] rounded-full" />
      </div>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <ToolsSection />
      <PricingSection />
      <Footer />
    </main>
  )
}
