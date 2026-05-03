// app/api/auth/signup/route.ts
// POST /api/auth/signup — create new user account

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signToken, createSessionCookie } from '@/lib/auth'

// Validation schema
const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = signupSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, email, password } = parsed.data

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user + subscription in a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { name, email, passwordHash, provider: 'email' },
      })
      // Auto-create free subscription
      await tx.subscription.create({
        data: {
          userId: newUser.id,
          plan: 'free',
          requestLimit: 20,
          resetAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      })
      return newUser
    })

    // Sign JWT
    const token = await signToken({ userId: user.id, email: user.email })
    const cookieSettings = createSessionCookie(token)

    const response = NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name },
    })

    response.cookies.set(cookieSettings)
    return response
  } catch (err) {
    console.error('[SIGNUP ERROR]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
