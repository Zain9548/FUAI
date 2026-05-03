// hooks/useAuth.ts
// Client-side authentication hook

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  // ── Fetch current user ────────────────────────────────────────────────────────
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const { data } = await res.json()
        setState({ user: data, loading: false, error: null })
      } else {
        setState({ user: null, loading: false, error: null })
      }
    } catch {
      setState({ user: null, loading: false, error: null })
    }
  }, [])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  // ── Login ─────────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (json.success) {
      setState({ user: json.data, loading: false, error: null })
      router.push('/dashboard')
      return { success: true }
    } else {
      setState((s) => ({ ...s, loading: false, error: json.error }))
      return { success: false, error: json.error }
    }
  }

  // ── Signup ────────────────────────────────────────────────────────────────────
  const signup = async (name: string, email: string, password: string) => {
    setState((s) => ({ ...s, loading: true, error: null }))
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const json = await res.json()
    if (json.success) {
      setState({ user: json.data, loading: false, error: null })
      router.push('/dashboard')
      return { success: true }
    } else {
      setState((s) => ({ ...s, loading: false, error: json.error }))
      return { success: false, error: json.error }
    }
  }

  // ── Logout ────────────────────────────────────────────────────────────────────
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setState({ user: null, loading: false, error: null })
    router.push('/')
  }

  return { ...state, login, signup, logout, refetch: fetchUser }
}
