import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatCard } from './StatCard'

describe('StatCard', () => {
  it('renders the label, value, and caption', () => {
    render(<StatCard label="Total pending amount" value="₹12,400" caption="Due" />)
    expect(screen.getByText('Total pending amount')).toBeInTheDocument()
    expect(screen.getByText('₹12,400')).toBeInTheDocument()
    expect(screen.getByText('Due')).toBeInTheDocument()
  })

  it('omits the caption when none is given', () => {
    render(<StatCard label="Total members" value={42} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })
})
