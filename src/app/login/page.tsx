// app/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(form.email, form.password)
    if (!result.success) {
      toast.error(result.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
      {/* Background glow */}
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center mb-10">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-violet-500 flex items-center justify-center text-sm font-bold font-display">
            F
          </span>
          <span className="text-2xl font-display font-bold text-white">
            FU<span className="gradient-text">AI</span>
          </span>
        </Link>

        <div className="glass rounded-2xl p-8">
          <h1 className="text-2xl font-display font-bold text-white mb-1">Welcome back</h1>
          <p className="text-slate-400 text-sm mb-8">Log in to your FUAI account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1.5 font-medium">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>

          <p className="text-sm text-slate-500 text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-sky-400 hover:text-sky-300 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
