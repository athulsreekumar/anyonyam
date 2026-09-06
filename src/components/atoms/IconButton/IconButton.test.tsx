import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Menu } from 'lucide-react'
import { IconButton } from './IconButton'

describe('IconButton', () => {
  it('requires and exposes an accessible name', () => {
    render(
      <IconButton aria-label="Open menu">
        <Menu aria-hidden />
      </IconButton>,
    )
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
  })

  it('calls onClick when activated', async () => {
    const onClick = vi.fn()
    render(
      <IconButton aria-label="Open menu" onClick={onClick}>
        <Menu aria-hidden />
      </IconButton>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Open menu' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
