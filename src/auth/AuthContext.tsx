import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearAuth, readAuth, writeAuth } from '@/lib/authStorage'
import type { Role, StoredAuth } from '@/lib/authStorage'

export interface AuthContextValue extends StoredAuth {
  isAuthenticated: boolean
  isAdmin: boolean
  login: (auth: { token: string; role: Role; memberNo: number; name: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<StoredAuth>(readAuth)

  const login = useCallback<AuthContextValue['login']>((next) => {
    writeAuth(next)
    setAuth(next)
  }, [])

  const logout = useCallback(() => {
    clearAuth()
    setAuth({ token: null, role: null, memberNo: null, name: null })
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      ...auth,
      isAuthenticated: Boolean(auth.token),
      isAdmin: auth.role === 'admin',
      login,
      logout,
    }),
    [auth, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}
