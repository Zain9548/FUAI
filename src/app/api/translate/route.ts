// app/api/translate/route.ts
// POST /api/translate — AI-powered translation endpoint

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSessionFromRequest } from '@/lib/auth'
import { translateText, LANGUAGES } from '@/lib/translate'

const validCodes = LANGUAGES.map((l) => l.code) as [string, ...string[]]

const schema = z.object({
  text: z.string().min(1, 'Text is required').max(3000, 'Max 3000 characters'),
  targetCode: z.string(),
  targetLanguage: z.string(),
})

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Please log in' }, { status: 401 })
  }

  const body = await req.json().catch(() => ({}))
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.errors[0].message },
      { status: 400 }
    )
  }

  try {
    const result = await translateText(
      parsed.data.text,
      parsed.data.targetLanguage,
      parsed.data.targetCode
    )
    return NextResponse.json({ success: true, data: { translation: result } })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Translation failed' },
      { status: 500 }
    )
  }
}