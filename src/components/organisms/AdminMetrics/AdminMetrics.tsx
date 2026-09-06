import { useMemo } from 'react'
import { StatCard } from '@/components/molecules/StatCard'
import { DonutChart } from '@/components/molecules/DonutChart'
import { Card } from '@/components/molecules/Card'
import { Heading } from '@/components/atoms/Heading'
import type { PaidSubscriptionResponse } from '@/types/admin'

export interface AdminMetricsProps {
  notPaidCount: number
  totalMembers: number
  pendingAmount: number
  unpaidProfiles: PaidSubscriptionResponse['paidSubscriptions']
}

const formatRupees = (value: number) => `₹${value.toLocaleString('en-IN')}`

export function AdminMetrics({ notPaidCount, totalMembers, pendingAmount, unpaidProfiles }: AdminMetricsProps) {
  const buckets = useMemo(() => {
    let over2000 = 0
    let mid = 0
    let under1000 = 0
    unpaidProfiles.forEach((profile) => {
      const amount = Number(profile.Subscription) || 0
      if (amount >= 2000) over2000 += 1
      else if (amount >= 1000) mid += 1
      else under1000 += 1
    })
    return [
      { label: 'Under ₹1,000', value: under1000, color: 'var(--color-gold-500)' },
      { label: '₹1,000–1,999', value: mid, color: 'var(--color-maroon-500)' },
      { label: '₹2,000+', value: over2000, color: 'var(--color-maroon-900)' },
    ]
  }, [unpaidProfiles])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Unpaid subscription" value={notPaidCount} caption="Not paid" />
        <StatCard label="Total number of members" value={totalMembers} caption="Members" />
        <StatCard label="Total pending amount" value={formatRupees(pendingAmount)} caption="Due" />
      </div>

      {notPaidCount > 0 && (
        <Card>
          <Heading level="h3">Pending Subscription Breakdown</Heading>
          <div className="mt-4">
            <DonutChart data={buckets} centerLabel="Unpaid members" />
          </div>
        </Card>
      )}
    </div>
  )
}
