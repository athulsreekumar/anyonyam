import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SectionHeading } from './SectionHeading'

describe('SectionHeading', () => {
  it('renders the eyebrow, title, and description', () => {
    render(<SectionHeading eyebrow="Our Story" title="History" description="Since 1998." />)
    expect(screen.getByText('Our Story')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'History' })).toBeInTheDocument()
    expect(screen.getByText('Since 1998.')).toBeInTheDocument()
  })

  it('renders an action slot when provided', () => {
    render(<SectionHeading title="Gallery" action={<button type="button">View all</button>} />)
    expect(screen.getByRole('button', { name: 'View all' })).toBeInTheDocument()
  })
})
