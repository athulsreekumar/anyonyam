import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from './Avatar'

describe('Avatar', () => {
  it('renders the image when a src is given', () => {
    render(<Avatar src="/gallery/varshikam/varshikam-01.jpg" alt="Krishnan Namboodiri" />)
    expect(screen.getByRole('img', { name: 'Krishnan Namboodiri' })).toBeInTheDocument()
  })

  it('falls back to a placeholder icon with an accessible label when there is no src', () => {
    const { container } = render(<Avatar src={null} alt="Krishnan Namboodiri" />)
    expect(screen.getByRole('img', { name: 'Krishnan Namboodiri' })).toBeInTheDocument()
    expect(container.querySelector('img')).not.toBeInTheDocument()
  })
})
