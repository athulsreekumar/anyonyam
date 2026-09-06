import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminMetrics } from './AdminMetrics'

// 1 under ₹1,000, 2 in ₹1,000–1,999, 3 at ₹2,000+ (6 total) - deliberately
// uneven counts per bucket so each legend row's "n (pct%)" text is unique.
const unpaidProfiles = [
  { UNIQUEID: 'a', Name: 'A', MemberNo: 1, Mobile: '9000000001', Subscription: 500 },
  { UNIQUEID: 'b', Name: 'B', MemberNo: 2, Mobile: '9000000002', Subscription: 1200 },
  { UNIQUEID: 'c', Name: 'C', MemberNo: 3, Mobile: '9000000003', Subscription: 1300 },
  { UNIQUEID: 'd', Name: 'D', MemberNo: 4, Mobile: '9000000004', Subscription: 2100 },
  { UNIQUEID: 'e', Name: 'E', MemberNo: 5, Mobile: '9000000005', Subscription: 2200 },
  { UNIQUEID: 'f', Name: 'F', MemberNo: 6, Mobile: '9000000006', Subscription: 2300 },
]

describe('AdminMetrics', () => {
  it('renders the three summary stats', () => {
    render(
      <AdminMetrics notPaidCount={7} totalMembers={52} pendingAmount={9999} unpaidProfiles={unpaidProfiles} />,
    )
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('52')).toBeInTheDocument()
    expect(screen.getByText('₹9,999')).toBeInTheDocument()
  })

  it('buckets unpaid members by amount into the breakdown chart', () => {
    render(
      <AdminMetrics notPaidCount={7} totalMembers={52} pendingAmount={9999} unpaidProfiles={unpaidProfiles} />,
    )
    expect(screen.getByRole('heading', { name: 'Pending Subscription Breakdown' })).toBeInTheDocument()
    expect(screen.getByText('1 (17%)')).toBeInTheDocument()
    expect(screen.getByText('2 (33%)')).toBeInTheDocument()
    expect(screen.getByText('3 (50%)')).toBeInTheDocument()
  })

  it('hides the breakdown chart when nobody is unpaid', () => {
    render(<AdminMetrics notPaidCount={0} totalMembers={40} pendingAmount={0} unpaidProfiles={[]} />)
    expect(screen.queryByRole('heading', { name: 'Pending Subscription Breakdown' })).not.toBeInTheDocument()
  })
})
