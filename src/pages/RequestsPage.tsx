import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import { Heading } from '@/components/atoms/Heading'
import { Spinner } from '@/components/atoms/Spinner'
import { Text } from '@/components/atoms/Text'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { IncomingRequestCard } from '@/components/molecules/IncomingRequestCard'
import { OutgoingRequestCard } from '@/components/molecules/OutgoingRequestCard'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import type { IncomingContactRequest, OutgoingContactRequest } from '@/types/directory'

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function RequestsPage() {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(true)
  const [incoming, setIncoming] = useState<IncomingContactRequest[]>([])
  const [outgoing, setOutgoing] = useState<OutgoingContactRequest[]>([])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [incomingRes, outgoingRes] = await Promise.all([
        api.get<IncomingContactRequest[]>('/contact-requests/incoming'),
        api.get<OutgoingContactRequest[]>('/contact-requests/outgoing'),
      ])
      setIncoming(incomingRes.data)
      setOutgoing(outgoingRes.data)
    } catch {
      showToast("Couldn't load your requests. Please refresh.", 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  async function respond(id: number, approve: boolean) {
    try {
      await api.put(`/contact-requests/${id}/respond`, { approve })
      showToast(approve ? 'Request approved.' : 'Request rejected.', 'success')
      await fetchAll()
    } catch (err) {
      showToast(errorMessage(err, 'Failed to respond to this request.'), 'error')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Member Area" title="Contact Requests" />

      <div className="mt-10">
        <Heading level="h3">Requests for you</Heading>
        <div className="mt-4 flex flex-col gap-3">
          {incoming.length === 0 && <Text tone="muted">No one has requested your contact details yet.</Text>}
          {incoming.map((r) => (
            <IncomingRequestCard key={r.id} request={r} onRespond={(approve) => respond(r.id, approve)} />
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Heading level="h3">Your requests</Heading>
        <div className="mt-4 flex flex-col gap-3">
          {outgoing.length === 0 && <Text tone="muted">You haven't requested anyone's contact details yet.</Text>}
          {outgoing.map((r) => (
            <OutgoingRequestCard key={r.id} request={r} />
          ))}
        </div>
      </div>
    </div>
  )
}
