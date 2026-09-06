import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { ContactPage } from './ContactPage'
import { contact } from '@/content/site'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('ContactPage', () => {
  it('renders the contact details', () => {
    renderWithProviders(<ContactPage />)
    expect(screen.getByRole('link', { name: contact.phone })).toBeInTheDocument()
  })

  it('renders the Naalukettu booking panel', () => {
    renderWithProviders(<ContactPage />)
    expect(screen.getByRole('heading', { name: 'Naalukettu Booking' })).toBeInTheDocument()
  })
})
