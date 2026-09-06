import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContactPanel } from './ContactPanel'
import { contact } from '@/content/site'

describe('ContactPanel', () => {
  it('renders working phone and email links, plus the address', () => {
    render(<ContactPanel />)
    expect(screen.getByRole('link', { name: contact.phone })).toHaveAttribute('href', contact.phoneHref)
    expect(screen.getByRole('link', { name: contact.email })).toHaveAttribute('href', `mailto:${contact.email}`)
    expect(screen.getByText(contact.addressLines[0]!)).toBeInTheDocument()
  })
})
