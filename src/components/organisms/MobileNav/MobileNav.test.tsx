import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileNav } from './MobileNav'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('MobileNav', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lists every public nav item plus a login link when open and signed out', () => {
    renderWithProviders(<MobileNav open onOpenChange={() => {}} />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Gallery' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Member Login' })).toBeInTheDocument()
  })

  it('shows account links and a greeting when signed in, and no login link', () => {
    renderWithProviders(<MobileNav open onOpenChange={() => {}} />, {
      auth: { token: 't', role: 'user', memberNo: 4, name: 'Devi' },
    })
    expect(screen.getByText('Hi, Devi')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My Profile' })).toHaveAttribute('href', '/profile/4')
    expect(screen.queryByRole('link', { name: 'Member Login' })).not.toBeInTheDocument()
  })

  it('closes when a nav link is clicked', async () => {
    const onOpenChange = vi.fn()
    renderWithProviders(<MobileNav open onOpenChange={onOpenChange} />)
    await userEvent.click(screen.getByRole('link', { name: 'Gallery' }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('renders nothing when closed', () => {
    renderWithProviders(<MobileNav open={false} onOpenChange={() => {}} />)
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  })
})
