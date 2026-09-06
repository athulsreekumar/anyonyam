import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PendingSubscriptionTable } from './PendingSubscriptionTable'
import { ToastProvider } from '@/components/molecules/Toast'

vi.mock('@/lib/exportExcel', () => ({ exportToExcel: vi.fn().mockResolvedValue(undefined) }))
const { exportToExcel } = await import('@/lib/exportExcel')

const rows = [
  { UNIQUEID: 'ANYONYAM3_1', Name: 'Krishnan Namboodiri', MemberNo: 3, Mobile: '9876543210', Subscription: 500 },
  { UNIQUEID: 'ANYONYAM4_1', Name: 'Devi Antharjanam', MemberNo: 4, Mobile: '9876500002', Subscription: 1200 },
]

function renderTable(rowData = rows) {
  const onRowClick = vi.fn()
  render(
    <ToastProvider>
      <PendingSubscriptionTable rows={rowData} onRowClick={onRowClick} />
    </ToastProvider>,
  )
  return { onRowClick }
}

describe('PendingSubscriptionTable', () => {
  it('renders a row per unpaid member with a formatted amount', () => {
    renderTable()
    expect(screen.getByText('Krishnan Namboodiri')).toBeInTheDocument()
    expect(screen.getByText('₹1,200')).toBeInTheDocument()
  })

  it('shows an empty state when there is nothing pending', () => {
    renderTable([])
    expect(screen.getByText('No pending subscriptions. Everyone is paid up.')).toBeInTheDocument()
  })

  it('calls onRowClick with the clicked row', async () => {
    const { onRowClick } = renderTable()
    await userEvent.click(screen.getByText('Krishnan Namboodiri'))
    expect(onRowClick).toHaveBeenCalledWith(rows[0])
  })

  it('disables export when there are no rows', () => {
    renderTable([])
    expect(screen.getByRole('button', { name: /Export Excel/ })).toBeDisabled()
  })

  it('exports the visible rows with mapped column headers', async () => {
    renderTable()
    await userEvent.click(screen.getByRole('button', { name: /Export Excel/ }))
    expect(exportToExcel).toHaveBeenCalledWith(
      [
        { 'Member Number': 3, Name: 'Krishnan Namboodiri', Contact: '9876543210', 'Pending Amount': 500 },
        { 'Member Number': 4, Name: 'Devi Antharjanam', Contact: '9876500002', 'Pending Amount': 1200 },
      ],
      expect.stringMatching(/^PendingPayment_\d{1,2}-\d{1,2}-\d{4}$/),
    )
  })

  describe('pagination', () => {
    const manyRows = Array.from({ length: 60 }, (_, i) => ({
      UNIQUEID: `ANYONYAM${i}_1`,
      Name: `Member ${i}`,
      MemberNo: i,
      Mobile: '9876543210',
      Subscription: 100,
    }))

    it('does not show pagination controls at or under 10 rows', () => {
      renderTable(manyRows.slice(0, 10))
      expect(screen.queryByText(/Page \d+ of \d+/)).not.toBeInTheDocument()
    })

    it('shows at most 10 rows per page and a page indicator', () => {
      renderTable(manyRows)
      expect(screen.getByText('Member 0')).toBeInTheDocument()
      expect(screen.getByText('Member 9')).toBeInTheDocument()
      expect(screen.queryByText('Member 10')).not.toBeInTheDocument()
      expect(screen.getByText('Page 1 of 6')).toBeInTheDocument()
      expect(screen.getByText('Showing 1–10 of 60')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Previous/ })).toBeDisabled()
    })

    it('advances to the next page and back', async () => {
      renderTable(manyRows)
      await userEvent.click(screen.getByRole('button', { name: /Next/ }))

      expect(screen.getByText('Member 10')).toBeInTheDocument()
      expect(screen.queryByText('Member 0')).not.toBeInTheDocument()
      expect(screen.getByText('Page 2 of 6')).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: /Next/ }))
      expect(screen.getByText('Page 3 of 6')).toBeInTheDocument()
      expect(screen.getByText('Showing 21–30 of 60')).toBeInTheDocument()

      await userEvent.click(screen.getByRole('button', { name: /Previous/ }))
      expect(screen.getByText('Page 2 of 6')).toBeInTheDocument()
    })
  })
})
