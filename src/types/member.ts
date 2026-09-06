/**
 * Mirrors the `members` row shape as returned by the backend (see
 * anyonyamBE/backend/validators/schemas.js and routes/member.js). Optional
 * profile fields are genuinely optional — MIGRATIONS.md notes they may be
 * NULL/absent depending on what's been backfilled.
 */
export interface Member {
  UNIQUEID: string
  MemberNo: number
  Name: string
  Illam: string
  DOB: string | null
  Mobile: string
  RELATIONSHIP: string
  Area: string
  Subscription: number | string
  DATA_STATUS: string
  isAdmin?: 0 | 1
  PROFESSION?: string | null
  EDUCATION?: string | null
  Address?: string | null
  AMMATH?: string | null
  GRAMAM?: string | null
  VEDAM?: string | null
  GOTHRAM?: string | null
  BloodGroup?: string | null
}
