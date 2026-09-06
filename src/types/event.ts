import { env } from '@/lib/env'

/** Mirrors the shape returned by GET /events(/upcoming) in anyonyamBE. */
export interface EventItem {
  id: number
  title: string
  event_date: string
  venue: string
  description: string
  imageIds: number[]
}

export interface EventsResponse {
  events: EventItem[]
}

export function eventImageUrl(imageId: number): string {
  return `${env.apiBaseUrl}/events/images/${imageId}`
}
