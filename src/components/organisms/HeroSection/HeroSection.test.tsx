import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HeroSection } from './HeroSection'
import { org } from '@/content/site'

describe('HeroSection', () => {
  it('renders the org wordmark as the main heading', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1, name: org.malayalamName })).toBeInTheDocument()
  })

  it('links to the gallery and history pages', () => {
    render(
      <MemoryRouter>
        <HeroSection />
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Explore the Gallery' })).toHaveAttribute('href', '/gallery')
    expect(screen.getByRole('link', { name: 'Our Story' })).toHaveAttribute('href', '/about/history')
  })
})
