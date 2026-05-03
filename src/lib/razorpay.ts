// lib/razorpay.ts
// Server-side Razorpay utility — NEVER import this in client components
// Secret key stays here, never exposed to browser

import Razorpay from 'razorpay'
import crypto from 'crypto'

// ─── Razorpay instance (server-only) ─────────────────────────────────────────
export const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// ─── Plan configuration ────────────────────────────────────────────────────────
export const PLANS = {
  pro: {
    id: 'pro',
    name: 'FUAI Pro',
    amount: 3100,      // ₹31 in paise (Razorpay uses paise)
    currency: 'INR',
    description: '500 AI requests/month + all tools',
    requestLimit: 500,
  },
  enterprise: {
    id: 'enterprise',
    name: 'FUAI Enterprise',
    amount: 5400,     // ₹54 in paise
    currency: 'INR',
    description: 'Unlimited requests + team workspace',
    requestLimit: 9999,
  },
} as const

export type PlanId = keyof typeof PLANS

// ─── Create Razorpay order ────────────────────────────────────────────────────
export async function createRazorpayOrder(planId: PlanId, userId: string) {
  const plan = PLANS[planId]
  if (!plan) throw new Error(`Invalid plan: ${planId}`)

  const razorpay = getRazorpay()
  const order = await razorpay.orders.create({
    amount: plan.amount,
    currency: plan.currency,
    receipt: `rcpt_${userId.slice(-10)}_${Date.now()}`,
    notes: {
      planId,
      userId,
      planName: plan.name,
    },
  })

  return order
}

// ─── Verify Razorpay payment signature (CRITICAL security step) ───────────────
// Formula: HMAC-SHA256(orderId + "|" + paymentId, secret)
export function verifyPaymentSignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string
  paymentId: string
  signature: string
}): boolean {
  const body = `${orderId}|${paymentId}`
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  return expectedSignature === signature
}
