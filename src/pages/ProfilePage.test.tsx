import { beforeEach, describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { Route, Routes } from 'react-router-dom'
import { ProfilePage } from './ProfilePage'
import { renderWithProviders } from '@/test/renderWithProviders'
import type { RenderWithProvidersOptions } from '@/test/renderWithProviders'
import { server } from '@/test/mocks/server'
import { familyMemberFixture, memberFixture } from '@/test/fixtures/member'

function renderProfilePage(options: RenderWithProvidersOptions) {
  return renderWithProviders(
    <Routes>
      <Route path="/profile/:memberNo" element={<ProfilePage />} />
    </Routes>,
    { route: `/profile/${memberFixture.MemberNo}`, ...options },
  )
}

describe('ProfilePage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('loads and renders every family member', async () => {
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    expect(await screen.findByText(memberFixture.Name)).toBeInTheDocument()
    expect(screen.getByText(familyMemberFixture.Name)).toBeInTheDocument()
  })

  it('shows the Add Family Member button for the profile owner', async () => {
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    await screen.findByText(memberFixture.Name)
    expect(screen.getByRole('button', { name: 'Add Family Member' })).toBeInTheDocument()
  })

  it('hides the Add Family Member button when viewing as a non-owner, non-admin', async () => {
    server.use(
      http.get('http://localhost:8800/profile', () =>
        HttpResponse.json({ data: [memberFixture], isAdmin: false, userMemberNo: 99 }),
      ),
    )
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: 99, name: 'Someone Else' } })
    await screen.findByText(memberFixture.Name)
    expect(screen.queryByRole('button', { name: 'Add Family Member' })).not.toBeInTheDocument()
  })

  it('opens the detail modal when Show More is clicked', async () => {
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    await screen.findByText(memberFixture.Name)
    const [firstCardShowMore] = screen.getAllByRole('button', { name: 'Show More' })
    await userEvent.click(firstCardShowMore!)
    expect(await screen.findByRole('dialog')).toBeInTheDocument()
  })

  it('opens the add-family-member modal from the header button', async () => {
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    await screen.findByText(memberFixture.Name)
    await userEvent.click(screen.getByRole('button', { name: 'Add Family Member' }))
    expect(await screen.findByRole('dialog', { name: 'Add a Family Member' })).toBeInTheDocument()
  })

  it('shows an empty state when the profile has no members', async () => {
    server.use(
      http.get('http://localhost:8800/profile', () =>
        HttpResponse.json({ data: [], isAdmin: false, userMemberNo: memberFixture.MemberNo }),
      ),
    )
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    expect(await screen.findByText('No members found.')).toBeInTheDocument()
  })

  it('shows a toast when the profile fails to load', async () => {
    server.use(http.get('http://localhost:8800/profile', () => HttpResponse.json({ error: 'boom' }, { status: 500 })))
    renderProfilePage({ auth: { token: 't', role: 'user', memberNo: memberFixture.MemberNo, name: memberFixture.Name } })
    expect(await screen.findByText("Couldn't load this profile. Please try again.")).toBeInTheDocument()
  })

  it('grants manage access to an admin viewing someone else’s profile', async () => {
    server.use(
      http.get('http://localhost:8800/profile', () =>
        HttpResponse.json({ data: [memberFixture], isAdmin: true, userMemberNo: 1 }),
      ),
    )
    renderProfilePage({ auth: { token: 't', role: 'admin', memberNo: 1, name: 'Admin' } })
    await waitFor(() => expect(screen.getByRole('button', { name: 'Add Family Member' })).toBeInTheDocument())
  })
})
