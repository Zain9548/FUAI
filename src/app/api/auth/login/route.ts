// app/api/auth/login/route.ts
// POST /api/auth/login — authenticate existing user

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { signToken, createSessionCookie } from '@/lib/auth'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 400 }
      )
    }

    const { email, password } = parsed.data

    // Find user
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Sign token and set cookie
    const token = await signToken({ userId: user.id, email: user.email })
    const cookieSettings = createSessionCookie(token)

    const response = NextResponse.json({
      success: true,
      data: { id: user.id, email: user.email, name: user.name },
    })

    response.cookies.set(cookieSettings)
    return response
  } catch (err) {
    console.error('[LOGIN ERROR]', err)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
