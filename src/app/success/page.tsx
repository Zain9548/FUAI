// app/success/page.tsx
// Payment success page — shown after Razorpay payment is verified

'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const PLAN_DETAILS = {
  pro: {
    name: 'Pro',
    emoji: '⚡',
    color: 'from-sky-500 to-blue-600',
    requests: '500',
    features: ['500 AI requests/month', 'All 6 AI tools', 'Unlimited history', 'Translator (50+ languages)', 'Priority support'],
  },
  enterprise: {
    name: 'Enterprise',
    emoji: '🚀',
    color: 'from-violet-500 to-purple-600',
    requests: 'Unlimited',
    features: ['Unlimited AI requests', 'All tools + API access', 'Team workspace', 'Dedicated support', 'Custom integrations'],
  },
}

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = (searchParams.get('plan') || 'pro') as 'pro' | 'enterprise'
  const paymentId = searchParams.get('payment_id') || ''
  const plan = PLAN_DETAILS[planId] || PLAN_DETAILS.pro

  const [step, setStep] = useState(0)

  // Animate in steps
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 300)
    const t2 = setTimeout(() => setStep(2), 800)
    const t3 = setTimeout(() => setStep(3), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  // Auto-redirect to dashboard after 8 seconds
  useEffect(() => {
    const t = setTimeout(() => router.push('/dashboard'), 8000)
    return () => clearTimeout(t)
  }, [router])

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/8 blur-[100px] rounded-full animate-pulse-slow" />
        <div className="absolute top-1/4 left-1/4 w-[200px] h-[200px] bg-violet-500/6 blur-[60px] rounded-full animate-float" />
        {/* Confetti dots */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full animate-float"
            style={{
              left: `${5 + (i * 4.5) % 90}%`,
              top: `${10 + (i * 7) % 80}%`,
              background: i % 3 === 0 ? '#0ea5e9' : i % 3 === 1 ? '#6366f1' : '#22d3ee',
              animationDelay: `${(i * 0.3) % 3}s`,
              animationDuration: `${3 + (i % 3)}s`,
              opacity: 0.4,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-lg w-full text-center">

        {/* Success checkmark */}
        <div
          className={cn(
            'transition-all duration-700',
            step >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
          )}
        >
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${plan.color} opacity-20 animate-pulse-slow`} />
            <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center text-4xl shadow-xl`}>
              ✓
            </div>
          </div>
        </div>

        {/* Title */}
        <div
          className={cn(
            'transition-all duration-700 delay-200',
            step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <p className="text-sky-400 text-sm font-medium mb-2">Payment Successful</p>
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            Welcome to {plan.name}! {plan.emoji}
          </h1>
          <p className="text-slate-400 mb-6">
            Your subscription is now active. Enjoy {plan.requests} AI requests per month.
          </p>
        </div>

        {/* Plan features card */}
        <div
          className={cn(
            'transition-all duration-700 delay-300 mb-8',
            step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <div className="glass rounded-2xl p-6 text-left">
            <p className="text-sm font-semibold text-white mb-4">
              {plan.emoji} What&apos;s unlocked on your {plan.name} plan:
            </p>
            <ul className="space-y-2.5">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm text-slate-300">
                  <span className="text-sky-400 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Payment reference */}
          {paymentId && (
            <div className="mt-3 px-4 py-2.5 glass rounded-xl">
              <p className="text-xs text-slate-500">
                Payment ID: <span className="text-slate-400 font-mono">{paymentId}</span>
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div
          className={cn(
            'transition-all duration-700 delay-500 flex flex-col sm:flex-row gap-3 justify-center',
            step >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          )}
        >
          <Link
            href="/tools"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 transition-all shadow-lg shadow-sky-500/20"
          >
            Start using AI Tools →
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded-xl glass text-slate-300 text-sm font-medium hover:text-white hover:border-white/20 transition-all"
          >
            Go to Dashboard
          </Link>
        </div>

        {/* Auto redirect notice */}
        <p className="text-xs text-slate-600 mt-6">
          Redirecting to dashboard in 8 seconds...
        </p>
      </div>
    </div>
  )
}