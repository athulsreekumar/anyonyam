import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

export function LogoutPage() {
  const { logout } = useAuth()

  // Side effects belong in useEffect, not the render body - calling
  // logout() directly while rendering would update a parent's state
  // mid-render, which React rejects.
  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Navigate to="/" replace />
}
