// lib/translate.ts
// Translation utility — server-side only
// Uses OpenAI (or OpenRouter with same API shape)

export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'ar', label: 'Arabic (العربية)' },
  { code: 'fr', label: 'French (Français)' },
  { code: 'de', label: 'German (Deutsch)' },
  { code: 'es', label: 'Spanish (Español)' },
  { code: 'pt', label: 'Portuguese (Português)' },
  { code: 'ru', label: 'Russian (Русский)' },
  { code: 'zh', label: 'Chinese Simplified (中文)' },
  { code: 'zh-TW', label: 'Chinese Traditional (繁體)' },
  { code: 'ja', label: 'Japanese (日本語)' },
  { code: 'ko', label: 'Korean (한국어)' },
  { code: 'it', label: 'Italian (Italiano)' },
  { code: 'nl', label: 'Dutch (Nederlands)' },
  { code: 'pl', label: 'Polish (Polski)' },
  { code: 'tr', label: 'Turkish (Türkçe)' },
  { code: 'sv', label: 'Swedish (Svenska)' },
  { code: 'da', label: 'Danish (Dansk)' },
  { code: 'fi', label: 'Finnish (Suomi)' },
  { code: 'no', label: 'Norwegian (Norsk)' },
  { code: 'cs', label: 'Czech (Čeština)' },
  { code: 'sk', label: 'Slovak (Slovenčina)' },
  { code: 'ro', label: 'Romanian (Română)' },
  { code: 'hu', label: 'Hungarian (Magyar)' },
  { code: 'el', label: 'Greek (Ελληνικά)' },
  { code: 'bg', label: 'Bulgarian (Български)' },
  { code: 'hr', label: 'Croatian (Hrvatski)' },
  { code: 'uk', label: 'Ukrainian (Українська)' },
  { code: 'he', label: 'Hebrew (עברית)' },
  { code: 'fa', label: 'Persian (فارسی)' },
  { code: 'ur', label: 'Urdu (اردو)' },
  { code: 'bn', label: 'Bengali (বাংলা)' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'ta', label: 'Tamil (தமிழ்)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', label: 'Malayalam (മലയാളം)' },
  { code: 'th', label: 'Thai (ภาษาไทย)' },
  { code: 'vi', label: 'Vietnamese (Tiếng Việt)' },
  { code: 'id', label: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ms', label: 'Malay (Bahasa Melayu)' },
  { code: 'tl', label: 'Filipino (Tagalog)' },
  { code: 'sw', label: 'Swahili (Kiswahili)' },
  { code: 'af', label: 'Afrikaans' },
  { code: 'ca', label: 'Catalan (Català)' },
  { code: 'lt', label: 'Lithuanian (Lietuvių)' },
  { code: 'lv', label: 'Latvian (Latviešu)' },
  { code: 'et', label: 'Estonian (Eesti)' },
  { code: 'sl', label: 'Slovenian (Slovenščina)' },
  { code: 'sr', label: 'Serbian (Српски)' },
] as const

export type LanguageCode = typeof LANGUAGES[number]['code']

// ─── Translate text via AI ────────────────────────────────────────────────────
export async function translateText(
  text: string,
  targetLanguage: string,
  targetCode: string
): Promise<string> {
  // Demo mode fallback
  if (!process.env.OPENAI_API_KEY) {
    return `[DEMO] Translation to ${targetLanguage}: ${text}`
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator. Translate the provided text accurately into ${targetLanguage} (language code: ${targetCode}). 
Preserve formatting, tone, and meaning. Return ONLY the translated text — no explanations, no labels, no extra content.`,
        },
        { role: 'user', content: text },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  })

  if (!response.ok) {
    throw new Error(`Translation API error: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0]?.message?.content?.trim() || ''
}