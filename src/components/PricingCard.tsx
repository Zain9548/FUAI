// components/PricingCard.tsx
// Handles the full Razorpay payment flow:
// 1. Click "Buy Now" → POST /api/create-order
// 2. Open Razorpay checkout modal
// 3. On success → POST /api/verify-payment → redirect /success

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface PricingFeature {
  text: string
  included: boolean
}

interface PricingCardProps {
  planId: 'free' | 'pro' | 'enterprise'
  name: string
  price: string
  period?: string
  description: string
  features: PricingFeature[]
  highlighted?: boolean
  badge?: string
  ctaLabel?: string
}

// Extend window for Razorpay SDK (loaded via script tag)
declare global {
  interface Window {
    Razorpay: any
  }
}

export function PricingCard({
  planId,
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
  ctaLabel = 'Buy Now',
}: PricingCardProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Load Razorpay script dynamically ─────────────────────────────────────────
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true)
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // ── Handle payment flow ───────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (planId === 'free') {
      router.push('/signup')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Step 1: Load Razorpay SDK
      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) throw new Error('Failed to load payment gateway. Check your connection.')

      // Step 2: Create order on backend
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const orderData = await orderRes.json()

      if (!orderData.success) {
        if (orderRes.status === 401) {
          router.push('/login?redirect=/pricing')
          return
        }
        throw new Error(orderData.error || 'Failed to create order')
      }

      const { order, keyId, plan } = orderData

      // Step 3: Open Razorpay checkout modal
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'FUAI',
        description: plan.description,
        order_id: order.id,
        image: '/favicon.ico',
        theme: { color: '#0ea5e9' },
        prefill: {
          // You can pre-fill user details here if available
        },
        // Payment methods: UPI, cards, net banking, wallets
        config: {
          display: {
            blocks: {
              upi: { name: 'Pay via UPI / QR Code', instruments: [{ method: 'upi' }] },
              card: { name: 'Pay via Card', instruments: [{ method: 'card' }] },
              nb: { name: 'Net Banking', instruments: [{ method: 'netbanking' }] },
            },
            sequence: ['block.upi', 'block.card', 'block.nb'],
            preferences: { show_default_blocks: true },
          },
        },

        // ── Success handler ─────────────────────────────────────────────────
        handler: async (response: {
          razorpay_payment_id: string
          razorpay_order_id: string
          razorpay_signature: string
        }) => {
          try {
            // Step 4: Verify signature on backend (CRITICAL)
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId,
              }),
            })
            const verifyData = await verifyRes.json()

            if (!verifyData.success) {
              throw new Error(verifyData.error || 'Payment verification failed')
            }

            // Step 5: Store plan in localStorage for instant UI unlock
            localStorage.setItem('fuai_plan', planId)
            localStorage.setItem('fuai_payment_id', response.razorpay_payment_id)

            // Step 6: Redirect to success page
            router.push(
              `/success?plan=${planId}&payment_id=${response.razorpay_payment_id}`
            )
          } catch (err: any) {
            setError(err.message || 'Verification failed. Contact support.')
            setLoading(false)
          }
        },

        // ── Modal dismiss / failure ─────────────────────────────────────────
        modal: {
          ondismiss: () => {
            setLoading(false)
          },
        },
      }

      const rzp = new window.Razorpay(options)

      rzp.on('payment.failed', (response: any) => {
        setError(
          `Payment failed: ${response.error.description || 'Unknown error'}. Please try again.`
        )
        setLoading(false)
      })

      rzp.open()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'relative flex flex-col rounded-2xl p-6 transition-all duration-300',
        highlighted
          ? 'gradient-border bg-surface-card shadow-xl shadow-sky-500/10 scale-105'
          : 'glass hover:border-white/20'
      )}
    >
      {/* Badge */}
      {badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-sky-500 to-violet-500 text-xs font-semibold text-white whitespace-nowrap shadow-lg">
          {badge}
        </span>
      )}

      {/* Plan header */}
      <div className="mb-6">
        <p className="text-sm text-slate-400 mb-1 font-medium">{name}</p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-display font-bold text-white">{price}</span>
          {period && <span className="text-slate-400 pb-1">{period}</span>}
        </div>
        <p className="text-xs text-slate-500">{description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-1">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm">
            <span
              className={cn(
                'mt-0.5 flex-shrink-0 text-base',
                f.included ? 'text-sky-400' : 'text-slate-600'
              )}
            >
              {f.included ? '✓' : '✗'}
            </span>
            <span className={f.included ? 'text-slate-300' : 'text-slate-600 line-through'}>
              {f.text}
            </span>
          </li>
        ))}
      </ul>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
          {error}
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className={cn(
          'w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200',
          highlighted
            ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90 shadow-lg shadow-sky-500/25'
            : planId === 'free'
            ? 'border border-white/10 text-slate-300 hover:border-white/20 hover:text-white'
            : 'border border-violet-500/30 text-violet-300 hover:bg-violet-500/10',
          loading && 'cursor-wait opacity-70'
        )}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          ctaLabel
        )}
      </button>

      {/* Security badge */}
      {planId !== 'free' && (
        <p className="text-center text-xs text-slate-600 mt-3 flex items-center justify-center gap-1">
          <span>🔒</span> Secured by Razorpay
        </p>
      )}
    </div>
  )
}