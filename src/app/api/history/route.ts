export const dynamic = 'force-dynamic';
// app/api/history/route.ts
// GET /api/history — paginated request history for current user
// DELETE /api/history?id=xxx — delete a request

import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const toolType = searchParams.get('tool') || undefined

  const skip = (page - 1) * limit

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where: {
        userId: session.userId,
        ...(toolType ? { toolType } : {}),
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.request.count({
      where: {
        userId: session.userId,
        ...(toolType ? { toolType } : {}),
      },
    }),
  ])

  return NextResponse.json({
    success: true,
    data: {
      requests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  })
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
  }

  // Verify ownership
  const request = await prisma.request.findFirst({
    where: { id, userId: session.userId },
  })

  if (!request) {
    return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
  }

  await prisma.request.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
