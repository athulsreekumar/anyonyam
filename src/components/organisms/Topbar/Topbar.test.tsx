import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Topbar } from './Topbar'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('Topbar', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the logo linking home and the primary nav', () => {
    renderWithProviders(<Topbar />)
    expect(screen.getByRole('link', { name: 'Anyonyam home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
  })

  it('shows a Member Login link when signed out', () => {
    renderWithProviders(<Topbar />)
    expect(screen.getByRole('link', { name: 'Member Login' })).toHaveAttribute('href', '/login')
  })

  it('opens the mobile menu from the hamburger button', async () => {
    renderWithProviders(<Topbar />)
    expect(screen.queryByRole('dialog', { name: 'Menu' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(screen.getByRole('dialog', { name: 'Menu' })).toBeInTheDocument()
  })

  it('shows the member greeting and account links when signed in', () => {
    renderWithProviders(<Topbar />, { auth: { token: 't', role: 'user', memberNo: 4, name: 'Devi' } })
    expect(screen.getByText('Hi, Devi')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profile/4')
    expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', '/logout')
    expect(screen.queryByRole('link', { name: 'Member Login' })).not.toBeInTheDocument()
  })

  it('shows Admin and Search links only for an admin', () => {
    renderWithProviders(<Topbar />, { auth: { token: 't', role: 'admin', memberNo: 1, name: 'Admin' } })
    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Search' })).toHaveAttribute('href', '/search')
  })
})
