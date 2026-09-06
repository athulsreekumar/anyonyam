import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '@/auth/AuthContext'
import { ToastProvider } from '@/components/molecules/Toast'
import { writeAuth } from '@/lib/authStorage'
import type { StoredAuth } from '@/lib/authStorage'

export interface RenderWithProvidersOptions {
  route?: string
  /** Seeds localStorage before render so the app mounts already logged in. */
  auth?: StoredAuth
}

/**
 * Most Phase 2+ components need a router (NavLink) and auth context
 * (useAuth) at minimum; many also raise toasts. This wraps all three so
 * individual test files don't repeat the same three-provider nesting.
 */
export function renderWithProviders(ui: ReactElement, { route = '/', auth }: RenderWithProvidersOptions = {}) {
  if (auth) {
    writeAuth(auth)
  }
  return render(
    <AuthProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </ToastProvider>
    </AuthProvider>,
  )
}
