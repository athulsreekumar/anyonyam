import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HistoryPage } from './HistoryPage'
import { historyActivities, historyIntro } from '@/content/history'

describe('HistoryPage', () => {
  it('renders the page title, intro copy, and the activities list', () => {
    render(<HistoryPage />)
    expect(screen.getByRole('heading', { name: 'History' })).toBeInTheDocument()
    expect(screen.getByText(historyIntro[0]!)).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(historyActivities.length)
  })
})
