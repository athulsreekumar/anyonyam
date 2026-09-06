export interface ProfessionResult {
  UNIQUEID: string
  Name: string
  PROFESSION: string
}

export interface BloodDonorResult {
  UNIQUEID: string
  Name: string
  BloodGroup: string
}

export type DirectoryResult = ProfessionResult | BloodDonorResult

export type ContactRequestStatus = 'pending' | 'approved' | 'rejected'

export interface IncomingContactRequest {
  id: number
  requesterUniqueId: string
  requesterName: string
  context: string | null
  status: ContactRequestStatus
  created_at: string
  responded_at: string | null
}

export interface OutgoingContactRequest {
  id: number
  targetUniqueId: string
  targetName: string
  context: string | null
  status: ContactRequestStatus
  created_at: string
  responded_at: string | null
  /** Only present once status is 'approved' - the backend nulls it out otherwise. */
  Mobile: string | null
}
