// lib/ai.ts
// 🔥 Premium AI Engine (High-quality output)

import type { Tool, ToolType } from '@/types'

// ─── Tool Definitions (UPGRADED PROMPTS) ──────────────────────────────────────

export const TOOLS: Tool[] = [
  {
    id: 'rewrite',
    label: 'Rewrite',
    description: 'Rewrite your content professionally',
    icon: '✦',
    color: 'from-sky-500 to-blue-600',
    placeholder: 'Paste your text...',
    systemPrompt: `
You are a professional content editor.
Rewrite the text in a clear, polished, and professional tone.
Make it fluent, engaging, and human-like.
Do not add extra explanations.
Return only the final improved version.
`,
  },
  {
    id: 'summarize',
    label: 'Summarize',
    description: 'Summarize into key insights',
    icon: '◈',
    color: 'from-violet-500 to-purple-600',
    placeholder: 'Paste text...',
    systemPrompt: `
You are an expert summarizer.
Convert the text into concise, well-structured key points.
Use bullet points.
Keep it clear, sharp, and professional.
`,
  },
  {
    id: 'expand',
    label: 'Expand',
    description: 'Expand ideas deeply',
    icon: '⊕',
    color: 'from-emerald-500 to-teal-600',
    placeholder: 'Enter idea...',
    systemPrompt: `
You are a professional writer.
Expand the idea with depth, clarity, and examples.
Make it informative, structured, and easy to understand.
Use paragraphs.
`,
  },
  {
    id: 'translate',
    label: 'Translate',
    description: 'Translate text accurately',
    icon: '⟳',
    color: 'from-orange-500 to-amber-600',
    placeholder: 'Paste text...',
    systemPrompt: `
You are a professional translator.
Translate text accurately into the target language.
Preserve meaning, tone, and context.
Do not explain anything.
Return only translated text.
`,
  },
  {
    id: 'fix_grammar',
    label: 'Fix Grammar',
    description: 'Fix grammar perfectly',
    icon: '✓',
    color: 'from-rose-500 to-pink-600',
    placeholder: 'Paste text...',
    systemPrompt: `
You are a grammar expert.
Fix grammar, punctuation, and sentence structure.
Do not change meaning.
Return only corrected text.
`,
  },
  {
    id: 'tone_shift',
    label: 'Tone Shift',
    description: 'Change tone professionally',
    icon: '◎',
    color: 'from-cyan-500 to-sky-600',
    placeholder: 'Paste text...',
    systemPrompt: `
You are a communication expert.
Change the tone of the text as requested.
Make it natural, professional, and human-like.
`,
  },
]

// ─── Get Tool ─────────────────────────────────────────────────────────────────

export function getTool(id: ToolType): Tool | undefined {
  return TOOLS.find((t) => t.id === id)
}

// ─── OpenRouter Call (ENHANCED) ───────────────────────────────────────────────

async function callOpenRouter(messages: any[]) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3000',
      'X-Title': 'AI Premium App',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages,
      temperature: 0.6, // 🔥 more controlled output
      max_tokens: 2000,
      top_p: 0.9,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter Error: ${err}`)
  }

  const data = await res.json()

  return {
    output: data.choices?.[0]?.message?.content?.trim() || '',
    tokens: data.usage?.total_tokens || 0,
  }
}

// ─── Generate Output (SMART ENGINE) ───────────────────────────────────────────

export async function generateOutput(
  toolType: ToolType,
  inputText: string,
  targetLanguage?: string
): Promise<{ output: string; tokens: number }> {

  if (typeof window !== 'undefined') {
    throw new Error('AI must run on server only')
  }

  const tool = getTool(toolType)
  if (!tool) throw new Error(`Unknown tool: ${toolType}`)

  if (!process.env.OPENROUTER_API_KEY) {
    return {
      output: `⚠️ Demo Mode:\n\n${inputText}`,
      tokens: 0,
    }
  }

  let userPrompt = inputText

  // 🔥 SMART PROMPTING

  if (toolType === 'translate' && targetLanguage) {
    userPrompt = `
Translate the following text into ${targetLanguage}.
Ensure natural, fluent, and culturally correct translation.

Text:
${inputText}
`
  }

  if (toolType === 'tone_shift') {
    userPrompt = `
Improve and adjust the tone of the following text.
Make it more professional and impactful.

Text:
${inputText}
`
  }

  const messages = [
    {
      role: 'system',
      content: tool.systemPrompt,
    },
    {
      role: 'user',
      content: userPrompt,
    },
  ]

  return await callOpenRouter(messages)
}