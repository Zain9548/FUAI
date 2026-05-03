// components/dashboard/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: '◈' },
  { href: '/tools', label: 'AI Tools', icon: '✦' },
  { href: '/history', label: 'History', icon: '⊙' },
  { href: '/profile', label: 'Profile', icon: '◉' },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  return (
    <aside className="hidden md:flex w-56 flex-col bg-surface-card border-r border-white/5 py-6">
      {/* Logo */}
      <div className="px-4 mb-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-xs font-bold">
            F
          </span>
          <span className="text-lg font-display font-bold text-white">
            FU<span className="gradient-text">AI</span>
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all',
                active
                  ? 'bg-sky-500/10 text-sky-400 font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 mt-4">
        <div className="glass rounded-xl p-3">
          <p className="text-xs text-white font-medium truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="mt-3 w-full text-xs text-slate-500 hover:text-rose-400 transition-colors text-left"
          >
            Sign out →
          </button>
        </div>
      </div>
    </aside>
  )
}
