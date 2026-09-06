import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NavLink } from './NavLink'

describe('NavLink', () => {
  it('marks the current route with aria-current', () => {
    render(
      <MemoryRouter initialEntries={['/gallery']}>
        <NavLink to="/gallery">Gallery</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </MemoryRouter>,
    )
    expect(screen.getByRole('link', { name: 'Gallery' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current')
  })
})
