import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DonutChart } from './DonutChart'

const data = [
  { label: 'Under ₹1,000', value: 3, color: '#B8862E' },
  { label: '₹1,000–1,999', value: 2, color: '#A63446' },
  { label: '₹2,000+', value: 1, color: '#3D1114' },
]

describe('DonutChart', () => {
  it('renders the total in an accessible label', () => {
    render(<DonutChart data={data} centerLabel="Unpaid" />)
    expect(screen.getByRole('img', { name: 'Unpaid: 6' })).toBeInTheDocument()
  })

  it('lists every segment in the legend with its value and share', () => {
    render(<DonutChart data={data} centerLabel="Unpaid" />)
    expect(screen.getByText('Under ₹1,000')).toBeInTheDocument()
    expect(screen.getByText('3 (50%)')).toBeInTheDocument()
    expect(screen.getByText('₹2,000+')).toBeInTheDocument()
    expect(screen.getByText('1 (17%)')).toBeInTheDocument()
  })

  it('renders a neutral empty state when every value is zero', () => {
    render(<DonutChart data={[{ label: 'None', value: 0, color: '#000' }]} centerLabel="Unpaid" />)
    expect(screen.getByRole('img', { name: 'Unpaid: 0' })).toBeInTheDocument()
    expect(screen.getByText('0 (0%)')).toBeInTheDocument()
  })

  it('formats values with a custom formatter when given', () => {
    render(<DonutChart data={data} centerLabel="Unpaid" formatValue={(v) => `₹${v}`} />)
    expect(screen.getByRole('img', { name: 'Unpaid: ₹6' })).toBeInTheDocument()
  })
})
