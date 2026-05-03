// app/pricing/page.tsx
// Full pricing page with Razorpay payment integration

import { PricingCard } from '@/components/PricingCard'
import Link from 'next/link'

const PLANS = [
  {
    planId: 'free' as const,
    name: 'Free',
    price: '₹0',
    period: '',
    description: 'Get started with AI content tools',
    highlighted: false,
    ctaLabel: 'Get started free',
    features: [
      { text: '20 AI requests / month', included: true },
      { text: 'All 6 AI tools', included: true },
      { text: 'Request history (30 days)', included: true },
      { text: 'Translator (10 languages)', included: true },
      { text: 'Priority support', included: false },
      { text: 'API access', included: false },
      { text: 'Team workspace', included: false },
    ],
  },
  {
    planId: 'pro' as const,
    name: 'Pro',
    price: '₹31',
    period: '/mo',
    description: 'For creators & professionals',
    highlighted: true,
    badge: '⚡ Most Popular',
    ctaLabel: 'Buy Now — 31/mo',
    features: [
      { text: '500 AI requests / month', included: true },
      { text: 'All 6 AI tools', included: true },
      { text: 'Unlimited history', included: true },
      { text: 'Translator (50+ languages)', included: true },
      { text: 'support', included: true },
    ],
  },
  {
    planId: 'enterprise' as const,
    name: 'Enterprise',
    price: '₹56',
    period: '/mo',
    description: 'For teams and agencies',
    highlighted: true,
    ctaLabel: 'buy Now',
    features: [
      { text: 'Unlimited AI requests', included: true },
      { text: 'All 6 AI tools', included: true },
      { text: 'Unlimited history', included: true },
      { text: 'Translator (50+ languages)', included: true },
      { text: 'Priority support', included: true },
      { text: 'full use AI Tools', included: true },
      { text: 'Easy Support', included: true },
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">

        {/* Back nav */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white transition-colors mb-12"
        >
          ← Back to home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            All Plan use free AI Tools
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-white mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Start free. Upgrade when you need more power.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 items-start">
          {PLANS.map((plan) => (
            <PricingCard key={plan.planId} {...plan} />
          ))}
        </div>

        {/* Payment methods */}
        <div className="text-center mb-20">
          <p className="text-xs text-slate-600 mb-3">Accepted payment methods</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {['UPI / QR', 'Visa / Mastercard', 'Net Banking', 'Wallets', 'EMI'].map((m) => (
              <span
                key={m}
                className="px-3 py-1.5 glass rounded-lg text-xs text-slate-500"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-24">
          <h2 className="text-2xl font-display font-bold text-white text-center mb-10">
            Frequently asked questions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {[
              { q: 'Is my payment secure?', a: 'Yes. All payments are processed by Razorpay, a PCI-DSS compliant payment gateway. FUAI never stores your card details.' },
              { q: 'Can I Use Daily AI tools?', a: 'Absolutely. you can use daily all AI tools.' },
              { q: 'What if payment fails?', a: 'If a payment fails, your account will not be charged. Try again or contact support at mohdajeem010@gmail.com.' },
              { q: 'Do you offer refunds?', a: 'NO. We do not Refund offer.' },
              { q: 'What are the AI request limits?', a: 'Free: 20/month. Pro: 500/month. Enterprise: Unlimited. Limits reset on the 1st of each month.' },
              { q: 'Does the Pro plan include the Translator?', a: 'Yes! Pro and Enterprise plans include full access to the Translator with 50+ languages.' },
            ].map((faq, i) => (
              <div key={i} className="glass rounded-2xl p-5">
                <h3 className="font-semibold text-white text-sm mb-2">{faq.q}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-slate-400 mb-4">
            Need help choosing a plan?{' '}
            <a href="mailto:mohdajeem010@gmail.com" className="text-sky-400 hover:text-sky-300 transition-colors">
              Talk to us
            </a>
          </p>
          <p className="text-xs text-slate-600">
            All prices are in INR. GST applicable as per Indian tax laws.
          </p>
        </div>
      </div>
    </main>
  )
}