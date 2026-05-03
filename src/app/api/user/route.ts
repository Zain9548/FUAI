// app/api/user/route.ts
// PATCH /api/user — update user profile

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  avatarUrl: z.string().url().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  const user = await prisma.user.update({
    where: { id: session.userId },
    data: parsed.data,
    select: { id: true, email: true, name: true, avatarUrl: true },
  })

  return NextResponse.json({ success: true, data: user })
}

// GET /api/user/stats — dashboard stats
export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const [subscription, totalRequests, recentRequests] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.userId } }),
    prisma.request.count({ where: { userId: session.userId } }),
    prisma.request.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return NextResponse.json({
    success: true,
    data: { subscription, totalRequests, recentRequests },
  })
}
