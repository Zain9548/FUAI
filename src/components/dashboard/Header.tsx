// components/dashboard/Header.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/tools': 'AI Tools',
  '/history': 'History',
  '/profile': 'Profile',
}

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', icon: '◈' },
  { href: '/tools', label: 'Tools', icon: '✦' },
  { href: '/history', label: 'History', icon: '⊙' },
  { href: '/profile', label: 'Profile', icon: '◉' },
]

export function DashboardHeader() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  const title = PAGE_TITLES[pathname] || 'FUAI'

  return (
    <>
      <header className="bg-surface-card border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-display font-semibold text-white">{title}</h1>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
        >
          ☰
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-60 bg-surface-card p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                      active ? 'bg-sky-500/10 text-sky-400' : 'text-slate-400 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {item.icon} {item.label}
                  </Link>
                )
              })}
            </nav>
            <button
              onClick={logout}
              className="mt-8 text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
