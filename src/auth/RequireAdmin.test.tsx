import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { RequireAdmin } from './RequireAdmin'
import { AuthProvider } from './AuthContext'
import { writeAuth } from '@/lib/authStorage'

function renderAt(path: string) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>Login page</p>} />
          <Route path="/profile/:memberNo" element={<p>Own profile</p>} />
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <p>Admin dashboard</p>
              </RequireAdmin>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  )
}

describe('RequireAdmin', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('redirects to /login when not authenticated', () => {
    renderAt('/admin')
    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it("redirects a non-admin member to their own profile", () => {
    writeAuth({ token: 't', role: 'user', memberNo: 5, name: 'Dev' })
    renderAt('/admin')
    expect(screen.getByText('Own profile')).toBeInTheDocument()
  })

  it('renders the admin content for an admin', () => {
    writeAuth({ token: 't', role: 'admin', memberNo: 1, name: 'Admin' })
    renderAt('/admin')
    expect(screen.getByText('Admin dashboard')).toBeInTheDocument()
  })
})
