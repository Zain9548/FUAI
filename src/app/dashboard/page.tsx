// app/dashboard/page.tsx
// Main dashboard — usage stats + quick actions

import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { TOOLS } from '@/lib/ai'
import { formatDate, truncate, PLAN_LIMITS } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [user, subscription, recentRequests, totalRequests] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true, createdAt: true } }),
    prisma.subscription.findUnique({ where: { userId: session.userId } }),
    prisma.request.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.request.count({ where: { userId: session.userId } }),
  ])

  const plan = (subscription?.plan as keyof typeof PLAN_LIMITS) || 'free'
  const used = subscription?.requestsUsed || 0
  const limit = subscription?.requestLimit || 20
  const usagePct = Math.min((used / limit) * 100, 100)

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-display font-bold text-white">
          Good to see you, {user?.name?.split(' ')[0] || 'there'} 👋
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Here&apos;s your FUAI usage overview.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Usage */}
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Monthly usage</p>
          <p className="text-3xl font-display font-bold text-white mb-3">
            {used}<span className="text-slate-500 text-lg">/{limit}</span>
          </p>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all"
              style={{ width: `${usagePct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">{PLAN_LIMITS[plan].label} plan</p>
        </div>

        {/* Total generations */}
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Total generations</p>
          <p className="text-3xl font-display font-bold text-white">{totalRequests}</p>
          <p className="text-xs text-slate-500 mt-2">All time</p>
        </div>

        {/* Plan */}
        <div className="glass rounded-2xl p-5">
          <p className="text-xs text-slate-400 mb-1">Current plan</p>
          <p className="text-3xl font-display font-bold text-white capitalize">{plan}</p>
          {plan === 'free' && (
            <Link href="/pricing" className="text-xs text-sky-400 hover:text-sky-300 mt-2 inline-block transition-colors">
              Upgrade to Pro →
            </Link>
          )}
        </div>
      </div>

      {/* Quick Actions — Tools */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Quick start</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools?tool=${tool.id}`}
              className="group glass rounded-xl p-4 hover:border-white/20 transition-all"
            >
              <div className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br ${tool.color} text-base mb-3`}>
                {tool.icon}
              </div>
              <p className="text-sm font-medium text-white group-hover:gradient-text transition-all">{tool.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent history */}
      {recentRequests.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Recent</h3>
            <Link href="/history" className="text-xs text-sky-400 hover:text-sky-300 transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-2">
            {recentRequests.map((r) => (
              <div key={r.id} className="glass rounded-xl px-4 py-3 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-sky-400 mb-0.5 capitalize">{r.toolType.replace('_', ' ')}</p>
                  <p className="text-sm text-slate-300 truncate">{truncate(r.inputText, 80)}</p>
                </div>
                <p className="text-xs text-slate-600 flex-shrink-0">{formatDate(r.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
