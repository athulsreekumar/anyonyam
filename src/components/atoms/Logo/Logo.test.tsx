import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders the logo image', () => {
    render(<Logo />)
    expect(screen.getByRole('img', { name: 'Anyonyam logo' })).toBeInTheDocument()
  })

  it('shows the wordmark only when requested', () => {
    const { rerender } = render(<Logo />)
    expect(screen.queryByText('അന്യോന്യം')).not.toBeInTheDocument()

    rerender(<Logo withWordmark />)
    expect(screen.getByText('അന്യോന്യം')).toBeInTheDocument()
  })
})
