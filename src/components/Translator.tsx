// components/Translator.tsx
// AI-powered translator supporting 50+ languages
// Calls /api/translate on the backend (server-side AI call)

'use client'

import { useState } from 'react'
import { LANGUAGES } from '@/lib/translate'
import { cn, wordCount } from '@/lib/utils'
import toast from 'react-hot-toast'

export function Translator() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [targetCode, setTargetCode] = useState('hi')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const targetLanguage = LANGUAGES.find((l) => l.code === targetCode)?.label || 'Hindi'

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      toast.error('Please enter text to translate')
      return
    }
    if (inputText.length > 3000) {
      toast.error('Text too long (max 3000 characters)')
      return
    }

    setLoading(true)
    setOutputText('')

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, targetCode, targetLanguage }),
      })

      const json = await res.json()

      if (!json.success) {
        toast.error(json.error || 'Translation failed')
        return
      }

      setOutputText(json.data.translation)
      toast.success('Translated!')
    } catch {
      toast.error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!outputText) return
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    toast.success('Copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSwap = () => {
    setInputText(outputText)
    setOutputText('')
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-xs font-medium mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          50+ Languages · AI-Powered
        </div>
        <h2 className="text-3xl font-display font-bold text-white mb-2">
          Translate anything, instantly
        </h2>
        <p className="text-slate-400 text-sm">
          Powered by GPT — accurate, context-aware translations in 50+ languages
        </p>
      </div>

      {/* Language selector */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl flex-1 min-w-[140px]">
          <span className="text-slate-400 text-sm">From:</span>
          <span className="text-white text-sm font-medium">Auto-detect</span>
        </div>

        {/* Swap button */}
        <button
          onClick={handleSwap}
          disabled={!outputText}
          className="p-2.5 glass rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all disabled:opacity-30"
          title="Swap languages"
        >
          ⇄
        </button>

        {/* Target language dropdown */}
        <div className="flex-1 min-w-[200px]">
          <select
            value={targetCode}
            onChange={(e) => setTargetCode(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/20 transition-all appearance-none cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code} style={{ background: '#1e293b', color: 'white' }}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Input */}
        <div className="glass rounded-2xl p-4 flex flex-col min-h-[280px]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Source text</span>
            <span className="text-xs text-slate-600">{inputText.length}/3000</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, 3000))}
            placeholder="Type or paste text to translate..."
            className="flex-1 bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
            rows={10}
          />
          <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
            <button
              onClick={() => { setInputText(''); setOutputText('') }}
              className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
            >
              Clear
            </button>
            <span className="text-xs text-slate-600">{wordCount(inputText)} words</span>
          </div>
        </div>

        {/* Output */}
        <div className="glass rounded-2xl p-4 flex flex-col min-h-[280px] relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-violet-400 font-medium uppercase tracking-wider">
              → {targetLanguage}
            </span>
            {outputText && (
              <button
                onClick={handleCopy}
                className="text-xs glass px-3 py-1 rounded-lg text-slate-400 hover:text-white transition-all"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex-1 flex flex-col gap-3 pt-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-4 rounded"
                  style={{ width: `${55 + Math.random() * 40}%` }}
                />
              ))}
              <p className="text-xs text-slate-600 mt-2 animate-pulse">Translating...</p>
            </div>
          ) : outputText ? (
            <div className="flex-1 overflow-y-auto">
              <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
                {outputText}
              </p>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-slate-600 text-center">
                Translation will appear here
              </p>
            </div>
          )}

          {outputText && (
            <div className="pt-3 border-t border-white/5 mt-3">
              <span className="text-xs text-slate-600">{wordCount(outputText)} words</span>
            </div>
          )}
        </div>
      </div>

      {/* Translate button */}
      <div className="flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={loading || !inputText.trim()}
          className={cn(
            'px-10 py-3 rounded-xl text-sm font-semibold transition-all',
            'bg-gradient-to-r from-violet-500 to-purple-600 text-white',
            'hover:opacity-90 hover:scale-105 shadow-lg shadow-violet-500/20',
            'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Translating...
            </span>
          ) : (
            `Translate to ${targetLanguage.split(' ')[0]} →`
          )}
        </button>
      </div>

      {/* Language quick picks */}
      <div className="flex flex-wrap gap-2 justify-center mt-6">
        {['hi', 'ar', 'fr', 'de', 'es', 'zh', 'ja', 'ko', 'ru', 'pt'].map((code) => {
          const lang = LANGUAGES.find((l) => l.code === code)
          if (!lang) return null
          return (
            <button
              key={code}
              onClick={() => setTargetCode(code)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs transition-all',
                targetCode === code
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                  : 'glass text-slate-500 hover:text-white hover:border-white/15'
              )}
            >
              {lang.label.split(' ')[0]}
            </button>
          )
        })}
      </div>
    </div>
  )
}