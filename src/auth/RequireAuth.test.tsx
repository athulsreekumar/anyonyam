import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAuth } from './RequireAuth'
import { AuthProvider } from './AuthContext'
import { writeAuth } from '@/lib/authStorage'

function LoginStub() {
  return <p>Login page</p>
}

describe('RequireAuth', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when not authenticated', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/profile/3']}>
          <Routes>
            <Route path="/login" element={<LoginStub />} />
            <Route
              path="/profile/:memberNo"
              element={
                <RequireAuth>
                  <p>Profile page</p>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders the protected content when authenticated', () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/profile/3']}>
          <Routes>
            <Route path="/login" element={<LoginStub />} />
            <Route
              path="/profile/:memberNo"
              element={
                <RequireAuth>
                  <p>Profile page</p>
                </RequireAuth>
              }
            />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByText('Profile page')).toBeInTheDocument()
  })
})
