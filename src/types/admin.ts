import type { Member } from './member'

export interface PaidSubscriptionResponse {
  paidSubscriptions: Pick<Member, 'UNIQUEID' | 'Name' | 'MemberNo' | 'Mobile' | 'Subscription'>[]
  totalMembers: Member[]
  totalPending: number
}
