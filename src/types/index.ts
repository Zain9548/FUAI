// FUAI - Global TypeScript Types

export type Plan = 'free' | 'pro' | 'enterprise'

export type ToolType =
  | 'rewrite'
  | 'summarize'
  | 'expand'
  | 'translate'
  | 'fix_grammar'
  | 'tone_shift'

export interface User {
  id: string
  email: string
  name?: string | null
  avatarUrl?: string | null
  provider: string
  createdAt: Date
}

export interface Request {
  id: string
  userId: string
  toolType: ToolType
  inputText: string
  outputText: string
  model: string
  tokens: number
  createdAt: Date
}

export interface Subscription {
  id: string
  userId: string
  plan: Plan
  requestsUsed: number
  requestLimit: number
  resetAt: Date
}

export interface Tool {
  id: ToolType
  label: string
  description: string
  icon: string
  systemPrompt: string
  placeholder: string
  color: string
}

// API response shapes
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface GenerateResponse {
  output: string
  tokens: number
  requestId: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
  expires: string
}
