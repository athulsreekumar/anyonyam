import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders an h2 by default', () => {
    render(<Heading>Our Story</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: 'Our Story' })).toBeInTheDocument()
  })

  it('renders the semantic tag matching the requested level', () => {
    render(<Heading level="h3">Committees</Heading>)
    expect(screen.getByRole('heading', { level: 3, name: 'Committees' })).toBeInTheDocument()
  })

  it('renders the "display" level as an h1', () => {
    render(<Heading level="display">Anyonyam</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Anyonyam' })).toBeInTheDocument()
  })

  it('allows overriding the rendered tag independent of the visual level', () => {
    render(
      <Heading level="display" as="h2">
        Section title
      </Heading>,
    )
    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeInTheDocument()
  })
})
