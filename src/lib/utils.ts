// lib/utils.ts
// Shared utility helpers

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── cn — className helper ─────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Format date ───────────────────────────────────────────────────────────────
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

// ─── Truncate string ───────────────────────────────────────────────────────────
export function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str
}

// ─── Count words ───────────────────────────────────────────────────────────────
export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ─── Estimate read time (minutes) ─────────────────────────────────────────────
export function readTime(text: string): number {
  return Math.ceil(wordCount(text) / 200)
}

// ─── Plan limits ──────────────────────────────────────────────────────────────
export const PLAN_LIMITS = {
  free: { requests: 20, label: 'Free', price: '$0' },
  pro: { requests: 500, label: 'Pro', price: '31/mo' },
  enterprise: { requests: 9999, label: 'Enterprise', price: '54/mo' },
} as const

// ─── Check if usage limit reached ─────────────────────────────────────────────
export function isLimitReached(used: number, limit: number): boolean {
  return used >= limit
}
