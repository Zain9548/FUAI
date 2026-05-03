// app/tools/page.tsx
// AI Tool Interface — select tool, enter input, get AI output

'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { TOOLS } from '@/lib/ai'
import { wordCount } from '@/lib/utils'
import type { ToolType } from '@/types'
import { cn } from '@/lib/utils'
import { Translator } from '@/components/Translator'

function ToolsContent() {
  const searchParams = useSearchParams()
  const defaultTool = (searchParams.get('tool') as ToolType) || 'rewrite'

  const [selectedTool, setSelectedTool] = useState<ToolType>(defaultTool)
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [tokens, setTokens] = useState(0)
  const outputRef = useRef<HTMLDivElement>(null)

  const tool = TOOLS.find((t) => t.id === selectedTool)!

  // ── Generate ──────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error('Please enter some text first')
      return
    }
    if (input.length < 5) {
      toast.error('Input is too short')
      return
    }

    setLoading(true)
    setOutput('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType: selectedTool, inputText: input }),
      })

      const json = await res.json()

      if (!json.success) {
        if (json.limitReached) {
          toast.error('Monthly limit reached. Upgrade to Pro for more requests.')
        } else {
          toast.error(json.error || 'Something went wrong')
        }
        return
      }

      setOutput(json.data.output)
      setTokens(json.data.tokens)
      // Scroll to output
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      toast.success('Done!')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Copy output ───────────────────────────────────────────────────────────────
  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Tool selector */}
      <div className="flex flex-wrap gap-2">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTool(t.id as ToolType)
              setOutput('')
            }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              selectedTool === t.id
                ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                : 'glass text-slate-400 hover:text-white hover:border-white/20'
            )}
          >
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tool description */}
      <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r ${tool.color} bg-opacity-10`} style={{ background: 'rgba(14,165,233,0.06)' }}>
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${tool.color} text-sm`}>
          {tool.icon}
        </span>
        <div>
          <p className="text-sm font-semibold text-white">{tool.label}</p>
          <p className="text-xs text-slate-400">{tool.description}</p>
        </div>
      </div>

      {/* Editor area */}
      {selectedTool === 'translate' ? (
        <div className="mt-6">
          <Translator />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input */}
          <div className="glass rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Your text</p>
              <p className="text-xs text-slate-600">{wordCount(input)} words · {input.length}/5000</p>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, 5000))}
              placeholder={tool.placeholder}
              rows={12}
              className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
              <button
                onClick={() => { setInput(''); setOutput('') }}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading || !input.trim()}
                className={cn(
                  'px-6 py-2 rounded-xl text-sm font-semibold transition-all',
                  'bg-gradient-to-r from-sky-500 to-blue-600 text-white hover:opacity-90',
                  'disabled:opacity-40 disabled:cursor-not-allowed',
                  loading && 'cursor-wait'
                )}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `${tool.label} →`
                )}
              </button>
            </div>
          </div>

          {/* Output */}
          <div ref={outputRef} className="glass rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI output</p>
              {output && tokens > 0 && (
                <p className="text-xs text-slate-600">{tokens} tokens used</p>
              )}
            </div>

            {!output && !loading ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-slate-600 text-center">
                  Your AI-generated output will appear here.
                </p>
              </div>
            ) : loading ? (
              <div className="flex-1 space-y-3 pt-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-4 rounded"
                    style={{ width: `${60 + Math.random() * 35}%` }}
                  />
                ))}
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto">
                  <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{output}</p>
                </div>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-600">{wordCount(output)} words</p>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium glass hover:border-white/20 text-slate-300 hover:text-white transition-all"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ToolsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center text-white">Loading tools...</div>}>
      <ToolsContent />
    </Suspense>
  )
}
