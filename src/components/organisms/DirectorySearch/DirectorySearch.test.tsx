import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DirectorySearch } from './DirectorySearch'
import { ToastProvider } from '@/components/molecules/Toast'
import { memberFixture } from '@/test/fixtures/member'

function renderDirectorySearch() {
  return render(
    <ToastProvider>
      <DirectorySearch />
    </ToastProvider>,
  )
}

describe('DirectorySearch', () => {
  it('searches by profession and shows results', async () => {
    renderDirectorySearch()
    await userEvent.type(screen.getByRole('textbox', { name: 'Profession' }), 'Doctor')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText(memberFixture.Name)).toBeInTheDocument()
    expect(screen.getByText('Profession: Doctor')).toBeInTheDocument()
  })

  it('shows an empty state when no professions match', async () => {
    renderDirectorySearch()
    await userEvent.type(screen.getByRole('textbox', { name: 'Profession' }), 'Nobody Does This')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))

    expect(await screen.findByText('No members found for that profession.')).toBeInTheDocument()
  })

  it('rejects an empty profession search client-side', async () => {
    renderDirectorySearch()
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    expect(await screen.findByText('Enter a profession to search for')).toBeInTheDocument()
  })

  it('searches donors by blood group on selection', async () => {
    renderDirectorySearch()
    await userEvent.click(screen.getByRole('tab', { name: 'Blood Donors' }))
    await userEvent.selectOptions(screen.getByLabelText('Blood group'), 'O+')

    expect(await screen.findByText(memberFixture.Name)).toBeInTheDocument()
    expect(screen.getByText('Blood Group: O+')).toBeInTheDocument()
  })

  it('shows an empty state when no donors match', async () => {
    renderDirectorySearch()
    await userEvent.click(screen.getByRole('tab', { name: 'Blood Donors' }))
    await userEvent.selectOptions(screen.getByLabelText('Blood group'), 'AB-')

    expect(await screen.findByText('No donors found for that blood group.')).toBeInTheDocument()
  })

  it('sends a contact request from a search result', async () => {
    renderDirectorySearch()
    await userEvent.type(screen.getByRole('textbox', { name: 'Profession' }), 'Doctor')
    await userEvent.click(screen.getByRole('button', { name: 'Search' }))
    await screen.findByText(memberFixture.Name)

    await userEvent.click(screen.getByRole('button', { name: 'Request Contact' }))

    expect(await screen.findByText('Request sent.')).toBeInTheDocument()
    expect(await screen.findByText('Requested')).toBeInTheDocument()
  })
})
