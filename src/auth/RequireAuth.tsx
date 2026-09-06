import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Client-side route guard - a UX convenience, not the security boundary.
 * The backend enforces authorization independently on every request;
 * without this, an unauthenticated visitor could sit on /profile/:id
 * watching every API call fail instead of being sent straight to /login.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}
