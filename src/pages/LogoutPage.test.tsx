import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LogoutPage } from './LogoutPage'
import { AuthProvider } from '@/auth/AuthContext'
import { writeAuth } from '@/lib/authStorage'

describe('LogoutPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('clears auth and redirects home', () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/logout']}>
          <Routes>
            <Route path="/" element={<p>Home page</p>} />
            <Route path="/logout" element={<LogoutPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByText('Home page')).toBeInTheDocument()
    expect(localStorage.getItem('anyonyam.auth')).toBeNull()
  })
})
