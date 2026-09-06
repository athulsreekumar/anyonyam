import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { DirectoryPage } from './DirectoryPage'
import { renderWithProviders } from '@/test/renderWithProviders'

describe('DirectoryPage', () => {
  it('renders the page title and the search tabs', () => {
    renderWithProviders(<DirectoryPage />)
    expect(screen.getByRole('heading', { name: 'Member Directory' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Profession' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Blood Donors' })).toBeInTheDocument()
  })
})
