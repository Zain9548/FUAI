// components/landing/HeroSection.tsx
'use client'

import Link from 'next/link'
import { TOOLS } from '@/lib/ai'

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse-slow" />
          Powered by AI· Free to start
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-white mb-6 animate-fade-up">
          Transform any text
          <br />
          <span className="gradient-text">with AI precision</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up delay-100">
          Rewrite, summarize, expand, translate — FUAI gives you six powerful AI tools
          to reshape your content in seconds. No prompts required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up delay-200">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold text-sm hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-sky-500/20"
          >
            Start for free →
          </Link>
          <Link
            href="#tools"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 text-slate-300 font-medium text-sm hover:border-white/20 hover:text-white transition-all"
          >
            See all tools
          </Link>
        </div>

        {/* Social proof */}
        <p className="text-xs text-slate-600 mb-16 animate-fade-up delay-300">
          20 free requests per month · No credit card required
        </p>

        {/* Tool pills */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-up delay-400">
          {TOOLS.map((tool) => (
            <span
              key={tool.id}
              className="px-3 py-1.5 rounded-full bg-white/5 border border-white/8 text-xs text-slate-400 hover:text-white hover:border-white/20 transition-all cursor-default"
            >
              {tool.icon} {tool.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
