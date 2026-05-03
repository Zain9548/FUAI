// app/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { PLAN_LIMITS } from '@/lib/utils'
import { formatDate } from '@/lib/utils'

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((json) => {
      if (json.success) {
        setUser(json.data)
        setName(json.data.name || '')
      }
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const res = await fetch('/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const json = await res.json()
    if (json.success) {
      toast.success('Profile updated')
      setUser((u: any) => ({ ...u, name: json.data.name }))
    } else {
      toast.error(json.error || 'Failed to update')
    }
    setSaving(false)
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
      </div>
    )
  }

  const plan = (user.subscription?.plan as keyof typeof PLAN_LIMITS) || 'free'
  const planInfo = PLAN_LIMITS[plan]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Account info */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold text-white mb-5">Account details</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Email</label>
            <input
              value={user.email}
              disabled
              className="w-full bg-white/3 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </div>

      {/* Subscription */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold text-white mb-5">Subscription</h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white capitalize">{planInfo.label} Plan</p>
            <p className="text-xs text-slate-400">{planInfo.price}</p>
          </div>
          {plan === 'free' && (
            <Link href="/pricing" className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-semibold hover:opacity-90 transition-all">
              Upgrade to Pro
            </Link>
          )}
        </div>

        <div className="text-sm text-slate-400 space-y-1">
          <p>
            <span className="text-white font-medium">{user.subscription?.requestsUsed || 0}</span>
            /{user.subscription?.requestLimit || 20} requests used this month
          </p>
          {user.subscription?.resetAt && (
            <p>Resets: {formatDate(user.subscription.resetAt)}</p>
          )}
        </div>
      </div>

      {/* Account meta */}
      <div className="glass rounded-2xl p-6">
        <h3 className="font-display font-semibold text-white mb-4">Account info</h3>
        <p className="text-sm text-slate-400">
          Member since <span className="text-white">{formatDate(user.createdAt)}</span>
        </p>
      </div>
    </div>
  )
}
