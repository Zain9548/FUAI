// app/history/page.tsx
// Paginated request history with filter and delete

'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { formatDate, truncate } from '@/lib/utils'
import { TOOLS } from '@/lib/ai'
import { cn } from '@/lib/utils'
import type { Request, ToolType } from '@/types'

export default function HistoryPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filterTool, setFilterTool] = useState<ToolType | ''>('')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchHistory = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: '10' })
    if (filterTool) params.set('tool', filterTool)
    const res = await fetch(`/api/history?${params}`)
    const json = await res.json()
    if (json.success) {
      setRequests(json.data.requests)
      setTotalPages(json.data.pagination.pages)
    }
    setLoading(false)
  }, [page, filterTool])

  useEffect(() => { fetchHistory() }, [fetchHistory])

  const handleDelete = async (id: string) => {
    setDeleting(id)
    const res = await fetch(`/api/history?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Deleted')
      setRequests((r) => r.filter((x) => x.id !== id))
    } else {
      toast.error('Failed to delete')
    }
    setDeleting(null)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => { setFilterTool(''); setPage(1) }}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
            filterTool === '' ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'glass text-slate-400 hover:text-white'
          )}
        >
          All
        </button>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => { setFilterTool(t.id as ToolType); setPage(1) }}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filterTool === t.id ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30' : 'glass text-slate-400 hover:text-white'
            )}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-20 rounded-2xl" />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-slate-400 mb-4">No generations yet.</p>
          <Link href="/tools" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">
            Start with an AI tool →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const tool = TOOLS.find((t) => t.id === r.toolType)
            const isExpanded = expanded === r.id
            return (
              <div key={r.id} className="glass rounded-2xl overflow-hidden transition-all">
                <div className="p-4 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${tool?.color || 'from-slate-500 to-slate-600'} bg-opacity-15`}
                        style={{ background: 'rgba(14,165,233,0.1)', color: '#7dd3fc' }}>
                        {tool?.icon} {tool?.label || r.toolType}
                      </span>
                      <span className="text-xs text-slate-600">{formatDate(r.createdAt)}</span>
                    </div>
                    <p className="text-sm text-slate-300 truncate">{truncate(r.inputText, 100)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setExpanded(isExpanded ? null : r.id)}
                      className="text-xs text-slate-500 hover:text-white transition-colors px-2 py-1 glass rounded-lg"
                    >
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      disabled={deleting === r.id}
                      className="text-xs text-slate-600 hover:text-rose-400 transition-colors px-2 py-1"
                    >
                      {deleting === r.id ? '...' : '×'}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-white/5 p-4 space-y-3">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Input</p>
                      <p className="text-sm text-slate-300 bg-white/3 rounded-xl p-3 whitespace-pre-wrap">{r.inputText}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Output</p>
                      <p className="text-sm text-slate-200 bg-white/3 rounded-xl p-3 whitespace-pre-wrap">{r.outputText}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 glass rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            ← Prev
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 glass rounded-xl text-sm text-slate-400 hover:text-white disabled:opacity-30 transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
