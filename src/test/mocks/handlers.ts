import { HttpResponse, http } from 'msw'
import type { HttpHandler } from 'msw'
import { familyMemberFixture, memberFixture } from '@/test/fixtures/member'
import { eventFixture } from '@/test/fixtures/event'
import { pendingBookingFixture } from '@/test/fixtures/booking'

const BASE = 'http://localhost:8800'

/**
 * Shared fixtures + handlers for the endpoints Phase 2 pages actually
 * call. Individual test files can override a handler per-test with
 * `server.use(...)` for error-path coverage.
 */
export const handlers: HttpHandler[] = [
  http.post(`${BASE}/login`, async ({ request }) => {
    const body = (await request.json()) as { phone: string }
    if (body.phone === '0000000000') {
      return HttpResponse.json({ error: 'Phone number not found. Please contact admin.' }, { status: 404 })
    }
    return HttpResponse.json({ message: 'OTP sent to the given number.' })
  }),

  http.post(`${BASE}/auth`, async ({ request }) => {
    const body = (await request.json()) as { phone: string; otp: string }
    if (body.otp !== '123456') {
      return HttpResponse.json({ error: 'OTP is invalid or has expired. Please request a new one.' }, { status: 401 })
    }
    return HttpResponse.json({
      success: true,
      token: 'test-jwt-token',
      role: 'user',
      name: 'Krishnan Namboodiri',
      memberNo: 3,
    })
  }),

  http.get(`${BASE}/profile`, ({ request }) => {
    const memberNo = new URL(request.url).searchParams.get('MemberNo')
    if (memberNo !== String(memberFixture.MemberNo)) {
      return HttpResponse.json({ error: 'Data not found' }, { status: 404 })
    }
    return HttpResponse.json({
      data: [memberFixture, familyMemberFixture],
      isAdmin: false,
      userMemberNo: memberFixture.MemberNo,
    })
  }),

  http.put(`${BASE}/member`, () => HttpResponse.json({ message: 'Member updated' })),
  http.delete(`${BASE}/member`, () => HttpResponse.json({ message: 'Member removed' })),
  http.post(`${BASE}/member`, () =>
    HttpResponse.json({ message: 'Member added', userData: [familyMemberFixture] }, { status: 201 }),
  ),
  http.post(`${BASE}/upload`, () => HttpResponse.json({ message: 'Image updated successfully' })),

  http.get(`${BASE}/paidSubscription`, () =>
    HttpResponse.json({
      paidSubscriptions: [
        { UNIQUEID: memberFixture.UNIQUEID, Name: memberFixture.Name, MemberNo: memberFixture.MemberNo, Mobile: memberFixture.Mobile, Subscription: 500 },
      ],
      totalMembers: [memberFixture, familyMemberFixture],
      totalPending: 500,
    }),
  ),
  http.put(`${BASE}/recordPayment`, () => HttpResponse.json({ message: 'Subscription updated successfully' })),
  http.post(`${BASE}/newmember`, () =>
    HttpResponse.json({ message: 'Member added', userData: [memberFixture] }, { status: 201 }),
  ),
  http.get(`${BASE}/allmembers`, () => HttpResponse.json([memberFixture, familyMemberFixture])),
  http.get(`${BASE}/search`, ({ request }) => {
    const name = new URL(request.url).searchParams.get('name') ?? ''
    if (name.toLowerCase().includes('nobody')) {
      return HttpResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return HttpResponse.json([memberFixture])
  }),

  http.get(`${BASE}/directory/profession`, ({ request }) => {
    const query = new URL(request.url).searchParams.get('query') ?? ''
    if (query.toLowerCase().includes('nobody')) return HttpResponse.json([])
    return HttpResponse.json([{ UNIQUEID: memberFixture.UNIQUEID, Name: memberFixture.Name, PROFESSION: 'Doctor' }])
  }),
  http.get(`${BASE}/directory/blood-donors`, ({ request }) => {
    const group = new URL(request.url).searchParams.get('group') ?? ''
    if (group === 'AB-') return HttpResponse.json([])
    return HttpResponse.json([{ UNIQUEID: memberFixture.UNIQUEID, Name: memberFixture.Name, BloodGroup: group }])
  }),
  http.post(`${BASE}/contact-requests`, () => HttpResponse.json({ message: 'Request sent.' }, { status: 201 })),
  http.get(`${BASE}/contact-requests/incoming`, () =>
    HttpResponse.json([
      {
        id: 1,
        requesterUniqueId: familyMemberFixture.UNIQUEID,
        requesterName: familyMemberFixture.Name,
        context: 'Found via Profession search: Doctor',
        status: 'pending',
        created_at: '2026-09-06T00:00:00.000Z',
        responded_at: null,
      },
    ]),
  ),
  http.get(`${BASE}/contact-requests/outgoing`, () =>
    HttpResponse.json([
      {
        id: 2,
        targetUniqueId: memberFixture.UNIQUEID,
        targetName: memberFixture.Name,
        context: 'Found via Blood Donor search: O+',
        status: 'approved',
        created_at: '2026-09-06T00:00:00.000Z',
        responded_at: '2026-09-06T01:00:00.000Z',
        Mobile: memberFixture.Mobile,
      },
    ]),
  ),
  http.put(`${BASE}/contact-requests/:id/respond`, () => HttpResponse.json({ message: 'Request approved.' })),

  http.get(`${BASE}/events/upcoming`, () => HttpResponse.json({ events: [eventFixture] })),
  http.get(`${BASE}/events`, () => HttpResponse.json({ events: [eventFixture] })),
  http.post(`${BASE}/events`, () => HttpResponse.json({ message: 'Event created', event: eventFixture }, { status: 201 })),
  http.put(`${BASE}/events/:id`, () => HttpResponse.json({ message: 'Event updated' })),
  http.delete(`${BASE}/events/:id`, () => HttpResponse.json({ message: 'Event removed' })),
  http.post(`${BASE}/events/:id/images`, () => HttpResponse.json({ message: 'Image added', imageId: 103 }, { status: 201 })),
  http.delete(`${BASE}/events/images/:id`, () => HttpResponse.json({ message: 'Image removed' })),

  http.get(`${BASE}/naalukettu/availability`, ({ request }) => {
    const month = new URL(request.url).searchParams.get('month')
    if (month === '2026-11') {
      return HttpResponse.json({ days: [{ event_date: '2026-11-15', status: 'blocked', note: 'Booked' }] })
    }
    return HttpResponse.json({ days: [] })
  }),
  http.post(`${BASE}/naalukettu/bookings`, () =>
    HttpResponse.json(
      { message: "Booking request submitted. The admin will review it and get in touch.", id: 1, estimatedCost: 2000 },
      { status: 201 },
    ),
  ),
  http.get(`${BASE}/naalukettu/bookings`, ({ request }) => {
    const status = new URL(request.url).searchParams.get('status')
    if (status && status !== pendingBookingFixture.status) return HttpResponse.json({ bookings: [] })
    return HttpResponse.json({ bookings: [pendingBookingFixture] })
  }),
  http.put(`${BASE}/naalukettu/bookings/:id/respond`, () => HttpResponse.json({ message: 'Booking approved.' })),
]
