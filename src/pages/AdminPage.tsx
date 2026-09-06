import { useCallback, useEffect, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { AdminMetrics } from '@/components/organisms/AdminMetrics'
import { PendingSubscriptionTable } from '@/components/organisms/PendingSubscriptionTable'
import { RecordPaymentModal } from '@/components/organisms/RecordPaymentModal'
import type { RecordPaymentModalMember } from '@/components/organisms/RecordPaymentModal'
import { CreateMemberModal } from '@/components/organisms/CreateMemberModal'
import { EventsAdminPanel } from '@/components/organisms/EventsAdminPanel'
import { NaalukettuBookingsAdminPanel } from '@/components/organisms/NaalukettuBookingsAdminPanel'
import { useToast } from '@/components/molecules/Toast'
import { useAuth } from '@/auth/AuthContext'
import { api } from '@/lib/apiClient'
import { exportToExcel } from '@/lib/exportExcel'
import type { PaidSubscriptionResponse } from '@/types/admin'

export function AdminPage() {
  const { name } = useAuth()
  const { showToast } = useToast()

  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<PaidSubscriptionResponse | null>(null)
  const [selectedForPayment, setSelectedForPayment] = useState<RecordPaymentModalMember | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [exportingAll, setExportingAll] = useState(false)

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get<PaidSubscriptionResponse>('/paidSubscription')
      setSummary(data)
    } catch {
      showToast("Couldn't load the dashboard. Please refresh.", 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  async function handleExportAll() {
    setExportingAll(true)
    try {
      const { data } = await api.get('/allmembers')
      await exportToExcel(data, 'exported_data')
    } catch {
      showToast('Failed to export member data.', 'error')
    } finally {
      setExportingAll(false)
    }
  }

  if (loading || !summary) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Member Area"
        title={`Admin Panel${name ? ` — ${name}` : ''}`}
        action={
          <div className="flex gap-3">
            <Button intent="secondary" loading={exportingAll} onClick={handleExportAll}>
              <Download aria-hidden className="h-4 w-4" />
              Export Data
            </Button>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus aria-hidden className="h-4 w-4" />
              Create User
            </Button>
          </div>
        }
      />

      <div className="mt-10">
        <AdminMetrics
          notPaidCount={summary.paidSubscriptions.length}
          totalMembers={summary.totalMembers.length}
          pendingAmount={summary.totalPending}
          unpaidProfiles={summary.paidSubscriptions}
        />
      </div>

      <div className="mt-10">
        <PendingSubscriptionTable
          rows={summary.paidSubscriptions}
          onRowClick={(row) => setSelectedForPayment(row)}
        />
      </div>

      <RecordPaymentModal
        member={selectedForPayment}
        onOpenChange={(open) => !open && setSelectedForPayment(null)}
        onRecorded={fetchSummary}
      />

      <CreateMemberModal open={createOpen} onOpenChange={setCreateOpen} onCreated={fetchSummary} />

      <div className="mt-14">
        <EventsAdminPanel />
      </div>

      <div className="mt-14">
        <NaalukettuBookingsAdminPanel />
      </div>
    </div>
  )
}
