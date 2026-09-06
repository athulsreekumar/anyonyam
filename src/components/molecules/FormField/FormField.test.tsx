import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FormField } from './FormField'
import { Input } from '@/components/atoms/Input'

describe('FormField', () => {
  it('associates the label with the control', () => {
    render(
      <FormField label="Phone number">
        <Input />
      </FormField>,
    )
    expect(screen.getByLabelText('Phone number')).toBeInTheDocument()
  })

  it('shows the hint when there is no error', () => {
    render(
      <FormField label="Phone number" hint="10 digits, no spaces">
        <Input />
      </FormField>,
    )
    expect(screen.getByText('10 digits, no spaces')).toBeInTheDocument()
  })

  it('shows the error, hides the hint, and marks the control invalid', () => {
    render(
      <FormField label="Phone number" hint="10 digits, no spaces" error="Enter a valid 10-digit number">
        <Input />
      </FormField>,
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Enter a valid 10-digit number')
    expect(screen.queryByText('10 digits, no spaces')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true')
  })
})
