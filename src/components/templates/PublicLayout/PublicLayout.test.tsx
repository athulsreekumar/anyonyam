import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { PublicLayout } from './PublicLayout'
import { AuthProvider } from '@/auth/AuthContext'

describe('PublicLayout', () => {
  it('renders the topbar, the routed page content, and the footer', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<p>Home page content</p>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByText('Home page content')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })
})
