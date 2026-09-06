import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { Footer } from './Footer'
import { renderWithProviders } from '@/test/renderWithProviders'
import { contact } from '@/content/site'

describe('Footer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the contact phone, email, and address when signed out', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByRole('link', { name: contact.phone })).toHaveAttribute('href', contact.phoneHref)
    expect(screen.getByRole('link', { name: contact.email })).toHaveAttribute('href', `mailto:${contact.email}`)
  })

  it('renders the footer nav with every public page when signed out', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByRole('navigation', { name: 'Footer' })).toBeInTheDocument()
  })

  it('shows the current year in the copyright line', () => {
    renderWithProviders(<Footer />)
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument()
  })

  it('collapses to a slim copyright bar when signed in', () => {
    renderWithProviders(<Footer />, { auth: { token: 't', role: 'user', memberNo: 3, name: 'Dev' } })
    expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()}`))).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Footer' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: contact.phone })).not.toBeInTheDocument()
  })
})
