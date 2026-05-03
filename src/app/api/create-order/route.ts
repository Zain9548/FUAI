// app/api/create-order/route.ts
// POST /api/create-order
// Creates a Razorpay order for a given plan
// Secret key NEVER leaves the server

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromRequest } from '@/lib/auth'
import { createRazorpayOrder, PLANS } from '@/lib/razorpay'

const schema = z.object({
  planId: z.enum(['pro', 'enterprise']),
})

export async function POST(req: NextRequest) {
  // ── 1. Auth check ────────────────────────────────────────────────────────────
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Please log in to continue' },
      { status: 401 }
    )
  }

  // ── 2. Validate input ────────────────────────────────────────────────────────
  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid plan selected' },
      { status: 400 }
    )
  }

  const { planId } = parsed.data

  // ── 3. Check Razorpay keys ────────────────────────────────────────────────────
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    // Demo mode — return mock order
    return NextResponse.json({
      success: true,
      demo: true,
      order: {
        id: `order_demo_${Date.now()}`,
        amount: PLANS[planId].amount,
        currency: 'INR',
      },
      keyId: 'rzp_test_demo',
      plan: PLANS[planId],
    })
  }

  // ── 4. Create Razorpay order ──────────────────────────────────────────────────
  try {
    const order = await createRazorpayOrder(planId, session.userId)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      keyId: process.env.RAZORPAY_KEY_ID,
      plan: PLANS[planId],
    })
  } catch (err: any) {
    console.error('[CREATE_ORDER ERROR]', err)
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to create payment order' },
      { status: 500 }
    )
  }
}