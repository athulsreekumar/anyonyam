import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { OtpInput } from './OtpInput'

function Controlled({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial)
  return <OtpInput value={value} onChange={setValue} autoFocus />
}

describe('OtpInput', () => {
  it('renders one box per digit', () => {
    render(<OtpInput value="" onChange={() => {}} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('typing a digit advances focus to the next box', async () => {
    render(<Controlled />)
    const boxes = screen.getAllByRole('textbox')
    boxes[0]!.focus()
    await userEvent.keyboard('4')
    expect(boxes[1]).toHaveFocus()
  })

  it('backspace on an empty box moves focus back', async () => {
    render(<Controlled initial="4" />)
    const boxes = screen.getAllByRole('textbox')
    boxes[1]!.focus()
    await userEvent.keyboard('{Backspace}')
    expect(boxes[0]).toHaveFocus()
  })

  it('pasting a full code fills every box', async () => {
    const onChange = vi.fn()
    render(<OtpInput value="" onChange={onChange} />)
    const boxes = screen.getAllByRole('textbox')
    await userEvent.click(boxes[0]!)
    await userEvent.paste('123456')
    expect(onChange).toHaveBeenCalledWith('123456')
  })

  it('marks every box invalid when invalid is set', () => {
    render(<OtpInput value="" onChange={() => {}} invalid />)
    screen.getAllByRole('textbox').forEach((box) => {
      expect(box).toHaveAttribute('aria-invalid', 'true')
    })
  })
})
