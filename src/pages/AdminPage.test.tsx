import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { AdminPage } from './AdminPage'
import { renderWithProviders } from '@/test/renderWithProviders'
import { server } from '@/test/mocks/server'
import { memberFixture } from '@/test/fixtures/member'

vi.mock('@/lib/exportExcel', () => ({ exportToExcel: vi.fn().mockResolvedValue(undefined) }))
const { exportToExcel } = await import('@/lib/exportExcel')

function renderAdminPage() {
  return renderWithProviders(<AdminPage />, {
    auth: { token: 't', role: 'admin', memberNo: 1, name: 'Admin' },
  })
}

describe('AdminPage', () => {
  it('renders the header with the admin name and the summary stats', async () => {
    // Two distinct rows so the aggregate total (₹1,000) can't coincidentally
    // match any single row's own amount.
    server.use(
      http.get('http://localhost:8800/paidSubscription', () =>
        HttpResponse.json({
          paidSubscriptions: [
            { UNIQUEID: 'a', Name: 'A', MemberNo: 1, Mobile: '9000000001', Subscription: 300 },
            { UNIQUEID: 'b', Name: 'B', MemberNo: 2, Mobile: '9000000002', Subscription: 700 },
          ],
          totalMembers: [memberFixture],
          totalPending: 1000,
        }),
      ),
    )
    renderAdminPage()
    expect(await screen.findByRole('heading', { name: 'Admin Panel — Admin' })).toBeInTheDocument()
    expect(screen.getByText('₹1,000')).toBeInTheDocument()
  })

  it('renders the pending subscription table with the fetched rows', async () => {
    renderAdminPage()
    expect(await screen.findByText(memberFixture.Name)).toBeInTheDocument()
  })

  it('opens the record-payment modal when a row is clicked', async () => {
    renderAdminPage()
    await screen.findByText(memberFixture.Name)
    await userEvent.click(screen.getByText(memberFixture.Name))
    expect(await screen.findByRole('dialog', { name: 'Record a Payment' })).toBeInTheDocument()
  })

  it('opens the create-member modal from the header button', async () => {
    renderAdminPage()
    await screen.findByText(memberFixture.Name)
    await userEvent.click(screen.getByRole('button', { name: /Create User/ }))
    expect(await screen.findByRole('dialog', { name: 'Create a New Member' })).toBeInTheDocument()
  })

  it('exports all members via the Export Data button', async () => {
    renderAdminPage()
    await screen.findByText(memberFixture.Name)
    await userEvent.click(screen.getByRole('button', { name: /Export Data/ }))
    expect(exportToExcel).toHaveBeenCalledWith(expect.any(Array), 'exported_data')
  })

  it('shows a toast when the dashboard fails to load', async () => {
    server.use(http.get('http://localhost:8800/paidSubscription', () => HttpResponse.json({ error: 'boom' }, { status: 500 })))
    renderAdminPage()
    expect(await screen.findByText("Couldn't load the dashboard. Please refresh.")).toBeInTheDocument()
  })
})
