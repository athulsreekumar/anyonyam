import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Text } from './Text'

describe('Text', () => {
  it('renders as a paragraph by default', () => {
    render(<Text>Visit us at Anyonyam Nalukettu</Text>)
    const el = screen.getByText('Visit us at Anyonyam Nalukettu')
    expect(el.tagName).toBe('P')
  })

  it('renders as a different element when "as" is given', () => {
    render(<Text as="span">Inline note</Text>)
    expect(screen.getByText('Inline note').tagName).toBe('SPAN')
  })
})
