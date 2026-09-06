import type { BookingRequest } from '@/types/naalukettu'

export const pendingBookingFixture: BookingRequest = {
  id: 1,
  member_uniqueid: null,
  requester_name: 'Test Requester',
  requester_phone: '9876543210',
  requester_email: null,
  pooja_type: 'Ganapathi Homam',
  event_date: '2026-10-15',
  food_required: 1,
  meal_type: 'breakfast',
  headcount: 20,
  estimated_cost: '2000.00',
  status: 'pending',
  admin_note: null,
  created_at: '2026-09-06T00:00:00.000Z',
  responded_at: null,
}
