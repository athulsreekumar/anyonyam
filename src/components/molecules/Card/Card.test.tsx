import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders its children', () => {
    render(<Card>Pending: ₹1,200</Card>)
    expect(screen.getByText('Pending: ₹1,200')).toBeInTheDocument()
  })
})
