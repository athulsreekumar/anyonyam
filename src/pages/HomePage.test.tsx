import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HomePage } from './HomePage'
import { eventFixture } from '@/test/fixtures/event'

describe('HomePage', () => {
  it('renders the hero, vision/mission, event banner, and contact section', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Vision' })).toBeInTheDocument()
    expect(await screen.findByRole('heading', { name: eventFixture.title })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Visit or Reach Out' })).toBeInTheDocument()
  })
})
