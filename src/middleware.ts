// middleware.ts
// Protects /dashboard, /tools, /history, /profile routes
// Redirects unauthenticated users to /login

import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/auth'

// Routes that require authentication
const PROTECTED_PATHS = ['/dashboard', '/tools', '/history', '/profile']

// Routes only for guests (redirect to dashboard if logged in)
const GUEST_ONLY_PATHS = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await getSessionFromRequest(request)

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isGuestOnly = GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p))

  if (isProtected && !session) {
    const url = new URL('/login', request.url)
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  if (isGuestOnly && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/tools/:path*', '/history/:path*', '/profile/:path*', '/login', '/signup'],
}
