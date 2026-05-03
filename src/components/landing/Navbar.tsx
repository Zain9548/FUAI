// components/landing/Navbar.tsx
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useAuth()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl border-b border-white/5 py-3'
          : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-sm font-bold font-display">
            F
          </span>
          <span className="text-xl font-display font-bold tracking-tight text-white">
            FU<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Tools', 'Pricing'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          ) : user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                  {(user.name || user.email || 'U').charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-slate-200 hidden sm:block">
                Dashboard
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm text-slate-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-blue-600 text-white font-medium hover:opacity-90 transition-opacity"
              >
                Get started free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
