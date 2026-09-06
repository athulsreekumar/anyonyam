import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TodayPage } from './TodayPage'
import { todayIntro } from '@/content/today'

describe('TodayPage', () => {
  it('renders the page title and intro copy', () => {
    render(<TodayPage />)
    expect(screen.getByRole('heading', { name: 'Anyonyam Today' })).toBeInTheDocument()
    expect(screen.getByText(todayIntro[0]!)).toBeInTheDocument()
  })
})
