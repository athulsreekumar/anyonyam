import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'
import { Input } from '@/components/atoms/Input'

describe('Label', () => {
  it('associates with its control via htmlFor', () => {
    render(
      <>
        <Label htmlFor="name">Full name</Label>
        <Input id="name" />
      </>,
    )
    expect(screen.getByLabelText('Full name')).toBeInTheDocument()
  })
})
