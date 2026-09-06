import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VisionMissionSection } from './VisionMissionSection'
import { mission, vision } from '@/content/site'

describe('VisionMissionSection', () => {
  it('renders both the vision and mission statements', () => {
    render(<VisionMissionSection />)
    expect(screen.getByRole('heading', { name: 'Vision' })).toBeInTheDocument()
    expect(screen.getByText(vision)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Mission' })).toBeInTheDocument()
    expect(screen.getByText(mission)).toBeInTheDocument()
  })
})
