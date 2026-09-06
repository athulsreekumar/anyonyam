import { useCallback, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { CalendarDays, ImagePlus, MapPin, Pencil, Plus, Trash2, X } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { IconButton } from '@/components/atoms/IconButton'
import { Spinner } from '@/components/atoms/Spinner'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog'
import { useToast } from '@/components/molecules/Toast'
import { EventFormModal } from '@/components/organisms/EventFormModal'
import { api } from '@/lib/apiClient'
import { eventImageUrl } from '@/types/event'
import type { EventItem, EventsResponse } from '@/types/event'

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

function formatDateLabel(isoDate: string): string {
  // See the identical helper in UpcomingEventBanner - avoids a UTC-midnight
  // parse shifting the displayed day west of UTC.
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

interface EventRowProps {
  event: EventItem
  onEdit: () => void
  onDelete: () => void
  onPhotosChanged: () => void
}

function EventRow({ event, onEdit, onDelete, onPhotosChanged }: EventRowProps) {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [removingImageId, setRemovingImageId] = useState<number | null>(null)

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('image', file)
      await api.post(`/events/${event.id}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      showToast('Photo added.', 'success')
      onPhotosChanged()
    } catch (err) {
      showToast(errorMessage(err, 'Failed to upload the photo.'), 'error')
    } finally {
      setUploading(false)
    }
  }

  async function handleRemoveImage(imageId: number) {
    setRemovingImageId(imageId)
    try {
      await api.delete(`/events/images/${imageId}`)
      onPhotosChanged()
    } catch (err) {
      showToast(errorMessage(err, 'Failed to remove the photo.'), 'error')
    } finally {
      setRemovingImageId(null)
    }
  }

  return (
    <Card surface="outlined" className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Text className="font-medium">{event.title}</Text>
          <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4">
            <Text tone="muted" size="sm" className="flex items-center gap-1.5">
              <CalendarDays aria-hidden className="h-3.5 w-3.5" />
              {formatDateLabel(event.event_date)}
            </Text>
            {event.venue && (
              <Text tone="muted" size="sm" className="flex items-center gap-1.5">
                <MapPin aria-hidden className="h-3.5 w-3.5" />
                {event.venue}
              </Text>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <IconButton aria-label={`Edit ${event.title}`} size="sm" onClick={onEdit}>
            <Pencil aria-hidden className="h-4 w-4" />
          </IconButton>
          <IconButton aria-label={`Delete ${event.title}`} size="sm" onClick={onDelete}>
            <Trash2 aria-hidden className="h-4 w-4" />
          </IconButton>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {event.imageIds.map((imageId) => (
          <div key={imageId} className="group relative h-16 w-16 overflow-hidden rounded-md">
            <img src={eventImageUrl(imageId)} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => handleRemoveImage(imageId)}
              disabled={removingImageId === imageId}
              className="absolute inset-0 flex items-center justify-center bg-maroon-900/60 text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
            >
              {removingImageId === imageId ? <Spinner size="sm" /> : <X aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        ))}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={handleFileSelected}
        />
        <Button
          type="button"
          intent="secondary"
          size="sm"
          loading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          <ImagePlus aria-hidden className="h-4 w-4" />
          Add Photo
        </Button>
      </div>
    </Card>
  )
}

/**
 * Admin-only "Manage Events" section: create, edit, delete, and attach
 * photos to the events that back the public GET /events/upcoming banner.
 * Shows every event (past and future, via GET /events) so admins can find
 * and edit something they scheduled after its date has passed.
 */
export function EventsAdminPanel() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [events, setEvents] = useState<EventItem[]>([])
  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EventItem | null>(null)

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get<EventsResponse>('/events')
      setEvents(data.events)
    } catch {
      showToast("Couldn't load events. Please refresh.", 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  function openCreate() {
    setEditingEvent(null)
    setFormOpen(true)
  }

  function openEdit(event: EventItem) {
    setEditingEvent(event)
    setFormOpen(true)
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await api.delete(`/events/${deleteTarget.id}`)
      showToast('Event removed.', 'success')
      setDeleteTarget(null)
      fetchEvents()
    } catch (err) {
      showToast(errorMessage(err, 'Failed to remove the event.'), 'error')
    }
  }

  return (
    <div>
      <SectionHeading
        title="Manage Events"
        description="Controls the upcoming-event banner on the homepage."
        action={
          <Button onClick={openCreate}>
            <Plus aria-hidden className="h-4 w-4" />
            Add Event
          </Button>
        }
      />

      <div className="mt-6 flex flex-col gap-3">
        {loading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}
        {!loading && events.length === 0 && <Text tone="muted">No events yet. Add one to get started.</Text>}
        {!loading &&
          events.map((event) => (
            <EventRow
              key={event.id}
              event={event}
              onEdit={() => openEdit(event)}
              onDelete={() => setDeleteTarget(event)}
              onPhotosChanged={fetchEvents}
            />
          ))}
      </div>

      <EventFormModal open={formOpen} onOpenChange={setFormOpen} event={editingEvent} onSaved={fetchEvents} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete this event?"
        description={`"${deleteTarget?.title}" and its photos will be removed permanently.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}
