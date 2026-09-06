import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from './Input'

describe('Input', () => {
  it('accepts typed input', async () => {
    render(<Input aria-label="Phone number" />)
    const input = screen.getByLabelText('Phone number')
    await userEvent.type(input, '9876543210')
    expect(input).toHaveValue('9876543210')
  })

  it('marks itself invalid via aria-invalid', () => {
    render(<Input aria-label="Phone number" invalid />)
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true')
  })

  it('forwards onChange', async () => {
    const onChange = vi.fn()
    render(<Input aria-label="Name" onChange={onChange} />)
    await userEvent.type(screen.getByLabelText('Name'), 'A')
    expect(onChange).toHaveBeenCalled()
  })
})
