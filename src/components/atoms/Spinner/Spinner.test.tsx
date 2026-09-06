import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('exposes a status role with an accessible label', () => {
    render(<Spinner label="Loading dashboard" />)
    const status = screen.getByRole('status')
    expect(status).toHaveTextContent('Loading dashboard')
  })

  it('defaults to "Loading" when no label is given', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading')
  })
})
