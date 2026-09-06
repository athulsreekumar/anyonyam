import { Phone } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import type { OutgoingContactRequest } from '@/types/directory'

export interface OutgoingRequestCardProps {
  request: OutgoingContactRequest
}

const STATUS_TONE = { pending: 'gold', approved: 'success', rejected: 'error' } as const

export function OutgoingRequestCard({ request }: OutgoingRequestCardProps) {
  return (
    <Card surface="outlined" className="flex items-center justify-between gap-4">
      <div>
        <Text className="font-medium">{request.targetName}</Text>
        {request.status === 'approved' && request.Mobile ? (
          <a href={`tel:${request.Mobile}`} className="mt-1 flex items-center gap-1.5 text-sm text-maroon-700 hover:text-maroon-900">
            <Phone aria-hidden className="h-3.5 w-3.5" />
            {request.Mobile}
          </a>
        ) : (
          request.context && (
            <Text tone="muted" size="sm">
              {request.context}
            </Text>
          )
        )}
      </div>
      <Badge tone={STATUS_TONE[request.status]} className="capitalize">
        {request.status}
      </Badge>
    </Card>
  )
}
