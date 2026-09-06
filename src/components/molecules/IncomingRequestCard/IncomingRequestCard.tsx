import { useState } from 'react'
import { Button } from '@/components/atoms/Button'
import { Badge } from '@/components/atoms/Badge'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import type { IncomingContactRequest } from '@/types/directory'

export interface IncomingRequestCardProps {
  request: IncomingContactRequest
  onRespond: (approve: boolean) => Promise<void>
}

const STATUS_TONE = { pending: 'gold', approved: 'success', rejected: 'error' } as const

export function IncomingRequestCard({ request, onRespond }: IncomingRequestCardProps) {
  const [responding, setResponding] = useState<'approve' | 'reject' | null>(null)

  async function handle(approve: boolean) {
    setResponding(approve ? 'approve' : 'reject')
    try {
      await onRespond(approve)
    } finally {
      setResponding(null)
    }
  }

  return (
    <Card surface="outlined" className="flex items-center justify-between gap-4">
      <div>
        <Text className="font-medium">{request.requesterName}</Text>
        {request.context && (
          <Text tone="muted" size="sm">
            {request.context}
          </Text>
        )}
      </div>
      {request.status === 'pending' ? (
        <div className="flex gap-2">
          <Button size="sm" intent="ghost" loading={responding === 'reject'} onClick={() => handle(false)}>
            Reject
          </Button>
          <Button size="sm" loading={responding === 'approve'} onClick={() => handle(true)}>
            Approve
          </Button>
        </div>
      ) : (
        <Badge tone={STATUS_TONE[request.status]} className="capitalize">
          {request.status}
        </Badge>
      )}
    </Card>
  )
}
