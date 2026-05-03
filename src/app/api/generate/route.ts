export const dynamic = 'force-dynamic';
// app/api/generate/route.ts
// POST /api/generate — core AI generation endpoint

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromRequest } from '@/lib/auth'
import { generateOutput } from '@/lib/ai'
import { prisma } from '@/lib/prisma'
import { isLimitReached } from '@/lib/utils'
import type { ToolType } from '@/types'

const generateSchema = z.object({
  toolType: z.enum(['rewrite', 'summarize', 'expand', 'translate', 'fix_grammar', 'tone_shift']),
  inputText: z.string().min(5, 'Input too short').max(5000, 'Input too long (max 5000 chars)'),
})

export async function POST(req: NextRequest) {
  // ── 1. Auth check ────────────────────────────────────────────────────────────
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Please log in to continue' }, { status: 401 })
  }

  // ── 2. Validate input ────────────────────────────────────────────────────────
  const body = await req.json()
  const parsed = generateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  const { toolType, inputText } = parsed.data

  // ── 3. Check usage limits ─────────────────────────────────────────────────────
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.userId },
  })

  if (!subscription) {
    return NextResponse.json({ success: false, error: 'Subscription not found' }, { status: 404 })
  }

  // Reset monthly usage if past reset date
  if (new Date() > subscription.resetAt) {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        requestsUsed: 0,
        resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    })
    subscription.requestsUsed = 0
  }

  if (isLimitReached(subscription.requestsUsed, subscription.requestLimit)) {
    return NextResponse.json(
      {
        success: false,
        error: `Monthly limit reached (${subscription.requestLimit} requests). Upgrade to Pro for more.`,
        limitReached: true,
      },
      { status: 429 }
    )
  }

  // ── 4. Generate output ────────────────────────────────────────────────────────
  const { output, tokens } = await generateOutput(toolType as ToolType, inputText)

  // ── 5. Save to DB and increment usage ─────────────────────────────────────────
  const [savedRequest] = await prisma.$transaction([
    prisma.request.create({
      data: {
        userId: session.userId,
        toolType,
        inputText,
        outputText: output,
        tokens,
      },
    }),
    prisma.subscription.update({
      where: { id: subscription.id },
      data: { requestsUsed: { increment: 1 } },
    }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      output,
      tokens,
      requestId: savedRequest.id,
    },
  })
}
