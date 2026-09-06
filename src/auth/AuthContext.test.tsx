import { describe, expect, it, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from './AuthContext'

function Consumer() {
  const { isAuthenticated, isAdmin, name, memberNo, login, logout } = useAuth()
  return (
    <div>
      <p>authenticated: {String(isAuthenticated)}</p>
      <p>admin: {String(isAdmin)}</p>
      <p>name: {name ?? 'none'}</p>
      <p>memberNo: {memberNo ?? 'none'}</p>
      <button onClick={() => login({ token: 't', role: 'admin', memberNo: 7, name: 'Krishnan' })}>Log in</button>
      <button onClick={logout}>Log out</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts unauthenticated when nothing is stored', () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    expect(screen.getByText('authenticated: false')).toBeInTheDocument()
    expect(screen.getByText('admin: false')).toBeInTheDocument()
  })

  it('login() persists auth state and updates context', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    expect(screen.getByText('authenticated: true')).toBeInTheDocument()
    expect(screen.getByText('admin: true')).toBeInTheDocument()
    expect(screen.getByText('name: Krishnan')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('anyonyam.auth')!)).toMatchObject({ name: 'Krishnan', memberNo: 7 })
  })

  it('logout() clears auth state and storage', async () => {
    render(
      <AuthProvider>
        <Consumer />
      </AuthProvider>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
    await userEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(screen.getByText('authenticated: false')).toBeInTheDocument()
    expect(localStorage.getItem('anyonyam.auth')).toBeNull()
  })

  it('throws when useAuth is used outside a provider', () => {
    expect(() => render(<Consumer />)).toThrow('useAuth must be used within an AuthProvider')
  })
})
