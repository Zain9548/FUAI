// components/landing/PricingSection.tsx
import Link from 'next/link'

export function PricingSection() {
  const plans = [
    {
      key: 'free',
      name: 'Free',
      price: '₹0',
      period: '',
      features: ['20 requests/month', 'All 6 AI tools', 'Request history (30 days)', 'Email support'],
      cta: 'Start free',
      href: '/signup',
      highlighted: false,
    },
    {
      key: 'pro',
      name: 'Pro',
      price: '₹31',
      period: '/mo',
      features: ['500 requests/month', 'All 6 AI tools', 'Unlimited history', 'Priority support', 'Translator (50+ languages)'],
      cta: 'Buy Now',
      href: '/pricing',
      highlighted: true,
    },
    {
      key: 'enterprise',
      name: 'Enterprise',
      price: '₹56',
      period: '/mo',
      features: ['Unlimited requests', 'All 6 AI tools', 'Unlimited', 'Dedicated support', 'All Tools use Unlimited'],
      cta: 'Buy Now',
      href: '/pricing',
      highlighted: true,
    },
  ]

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-slate-400">Start free. Upgrade when you need more.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl p-6 flex flex-col ${
                plan.highlighted
                  ? 'gradient-border bg-surface-card'
                  : 'glass'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}

              <div className="mb-6">
                <p className="text-sm text-slate-400 mb-1">{plan.name}</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-display font-bold text-white">{plan.price}</span>
                  {plan.period && <span className="text-slate-400 mb-1">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-sky-400 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90'
                    : 'border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}