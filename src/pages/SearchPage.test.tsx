import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router-dom'
import { SearchPage } from './SearchPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { memberFixture } from '@/test/fixtures/member'

function renderSearchPage() {
  return renderWithProviders(
    <Routes>
      <Route path="/search" element={<SearchPage />} />
      <Route path="/profile/:memberNo" element={<p>Profile page</p>} />
    </Routes>,
    { route: '/search' },
  )
}

describe('SearchPage', () => {
  it('shows matching results after a search', async () => {
    renderSearchPage()
    await userEvent.type(screen.getByLabelText('Search by name'), memberFixture.Name)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(await screen.findByText(memberFixture.Name)).toBeInTheDocument()
  })

  it('shows a "no members found" message for no matches', async () => {
    renderSearchPage()
    await userEvent.type(screen.getByLabelText('Search by name'), 'Nobody Here')
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(await screen.findByText('No members found.')).toBeInTheDocument()
  })

  it('navigates to the profile page when a result is clicked', async () => {
    renderSearchPage()
    await userEvent.type(screen.getByLabelText('Search by name'), memberFixture.Name)
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    await userEvent.click(await screen.findByText(memberFixture.Name))
    expect(await screen.findByText('Profile page')).toBeInTheDocument()
  })

  it('does not search on an empty query', async () => {
    renderSearchPage()
    await userEvent.click(screen.getByRole('button', { name: 'Go' }))
    expect(screen.queryByText('No members found.')).not.toBeInTheDocument()
  })
})
