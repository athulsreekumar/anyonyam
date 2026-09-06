/** Mirrors the shapes returned by anyonyamBE's routes/naalukettu.js. */
export type AvailabilityStatus = 'available' | 'blocked'
export type MealType = 'breakfast' | 'lunch' | 'dinner'

export interface AvailabilityDay {
  event_date: string
  status: AvailabilityStatus
  note: string | null
}

export interface AvailabilityResponse {
  days: AvailabilityDay[]
}

export interface CreateBookingResponse {
  message: string
  id: number
  estimatedCost: number | null
}

export type BookingStatus = 'pending' | 'approved' | 'rejected'

/** Mirrors GET /naalukettu/bookings's row shape. estimated_cost comes back
 * as a string - mysql2 doesn't parse DECIMAL columns to JS numbers. */
export interface BookingRequest {
  id: number
  member_uniqueid: string | null
  requester_name: string
  requester_phone: string
  requester_email: string | null
  pooja_type: string
  event_date: string | null
  food_required: number
  meal_type: MealType | null
  headcount: number | null
  estimated_cost: string | null
  status: BookingStatus
  admin_note: string | null
  created_at: string
  responded_at: string | null
}

export interface BookingsResponse {
  bookings: BookingRequest[]
}
