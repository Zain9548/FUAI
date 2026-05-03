export const dynamic = 'force-dynamic';
// app/api/verify-payment/route.ts
// POST /api/verify-payment
// Verifies Razorpay HMAC signature and upgrades user subscription
// This is the CRITICAL security checkpoint — never skip this

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromRequest } from '@/lib/auth'
import { verifyPaymentSignature, PLANS } from '@/lib/razorpay'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  planId: z.enum(['pro', 'enterprise']),
})

export async function POST(req: NextRequest) {
  // ── 1. Auth check ────────────────────────────────────────────────────────────
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Validate payload ───────────────────────────────────────────────────────
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid payment data' },
      { status: 400 }
    )
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    planId,
  } = parsed.data

  // ── 3. Demo mode bypass (no Razorpay keys configured) ────────────────────────
  if (!process.env.RAZORPAY_KEY_SECRET) {
    await upgradeSubscription(session.userId, planId)
    return NextResponse.json({
      success: true,
      demo: true,
      message: 'Demo payment verified. Subscription upgraded.',
      plan: planId,
    })
  }

  // ── 4. Verify HMAC-SHA256 signature ──────────────────────────────────────────
  const isValid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  })

  if (!isValid) {
    console.error('[VERIFY_PAYMENT] Invalid signature for order:', razorpay_order_id)
    return NextResponse.json(
      { success: false, error: 'Payment verification failed. Invalid signature.' },
      { status: 400 }
    )
  }

  // ── 5. Upgrade subscription in database ──────────────────────────────────────
  try {
    await upgradeSubscription(session.userId, planId)

    return NextResponse.json({
      success: true,
      message: 'Payment verified. Subscription upgraded successfully.',
      plan: planId,
      paymentId: razorpay_payment_id,
    })
  } catch (err: any) {
    console.error('[VERIFY_PAYMENT DB ERROR]', err)
    return NextResponse.json(
      { success: false, error: 'Payment verified but failed to upgrade. Contact support.' },
      { status: 500 }
    )
  }
}

// ─── Helper: upgrade user subscription in DB ──────────────────────────────────
async function upgradeSubscription(userId: string, planId: 'pro' | 'enterprise') {
  const plan = PLANS[planId]

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan: planId,
      requestLimit: plan.requestLimit,
      resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    create: {
      userId,
      plan: planId,
      requestLimit: plan.requestLimit,
      requestsUsed: 0,
      resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })
}