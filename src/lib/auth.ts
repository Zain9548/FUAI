// lib/auth.ts
// JWT helpers and session utilities

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fuai-dev-secret-change-in-production'
)
const COOKIE_NAME = 'fuai_session'

// ─── Sign a JWT token ──────────────────────────────────────────────────────────
export async function signToken(payload: {
  userId: string
  email: string
}): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

// ─── Verify and decode a JWT token ────────────────────────────────────────────
export async function verifyToken(
  token: string
): Promise<{ userId: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { userId: string; email: string }
  } catch {
    return null
  }
}

// ─── Get current session from cookies (Server Components) ─────────────────────
export async function getSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// ─── Get session from request (API Routes / Middleware) ───────────────────────
export async function getSessionFromRequest(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// ─── Set session cookie ────────────────────────────────────────────────────────
export function createSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  }
}

export { COOKIE_NAME }
