import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its label', () => {
    render(<Badge tone="gold">Admin</Badge>)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
