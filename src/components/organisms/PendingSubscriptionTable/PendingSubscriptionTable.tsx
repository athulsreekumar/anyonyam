import { useState } from 'react'
import { ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Text } from '@/components/atoms/Text'
import { exportToExcel } from '@/lib/exportExcel'
import { useToast } from '@/components/molecules/Toast'
import type { PaidSubscriptionResponse } from '@/types/admin'

export interface PendingSubscriptionTableProps {
  rows: PaidSubscriptionResponse['paidSubscriptions']
  onRowClick: (row: PaidSubscriptionResponse['paidSubscriptions'][number]) => void
}

const PAGE_SIZE = 10

function currentDateStamp(): string {
  const today = new Date()
  return `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
}

export function PendingSubscriptionTable({ rows, onRowClick }: PendingSubscriptionTableProps) {
  const { showToast } = useToast()
  const [exporting, setExporting] = useState(false)
  const [page, setPage] = useState(1)

  // Clamped at render time (rather than reset via an effect) so a shrinking
  // row count - e.g. after recording a payment drops someone off this list -
  // never strands the page past the end.
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + PAGE_SIZE)

  async function handleExport() {
    setExporting(true)
    try {
      await exportToExcel(
        rows.map((r) => ({
          'Member Number': r.MemberNo,
          Name: r.Name,
          Contact: r.Mobile,
          'Pending Amount': r.Subscription,
        })),
        `PendingPayment_${currentDateStamp()}`,
      )
    } catch {
      showToast('Failed to export the pending-subscription list.', 'error')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-body text-sm font-semibold tracking-wide text-maroon-900 uppercase">
          Pending Subscription
        </h3>
        <Button size="sm" intent="secondary" loading={exporting} disabled={rows.length === 0} onClick={handleExport}>
          <Download aria-hidden className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {rows.length === 0 ? (
        <Text tone="muted" className="mt-6">
          No pending subscriptions. Everyone is paid up.
        </Text>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-md border border-charcoal-600/10">
          <table className="w-full text-left font-body text-sm">
            <thead className="bg-cream-100 text-charcoal-600">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">
                  Member Number
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Contact
                </th>
                <th scope="col" className="px-4 py-3 font-medium">
                  Pending Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr
                  key={row.UNIQUEID}
                  onClick={() => onRowClick(row)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onRowClick(row)
                    }
                  }}
                  tabIndex={0}
                  className="cursor-pointer border-t border-charcoal-600/10 hover:bg-maroon-100/40 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-maroon-500"
                >
                  <td className="px-4 py-3">{row.MemberNo}</td>
                  <td className="px-4 py-3">{row.Name}</td>
                  <td className="px-4 py-3">{row.Mobile}</td>
                  <td className="px-4 py-3">₹{Number(row.Subscription).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length > PAGE_SIZE && (
        <div className="mt-3 flex items-center justify-between gap-4">
          <Text tone="muted" size="sm">
            Showing {pageStart + 1}–{Math.min(pageStart + PAGE_SIZE, rows.length)} of {rows.length}
          </Text>
          <div className="flex items-center gap-3">
            <Button
              size="sm"
              intent="ghost"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft aria-hidden className="h-4 w-4" />
              Previous
            </Button>
            <Text tone="muted" size="sm">
              Page {currentPage} of {totalPages}
            </Text>
            <Button
              size="sm"
              intent="ghost"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Next
              <ChevronRight aria-hidden className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
