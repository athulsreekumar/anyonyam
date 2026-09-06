import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'

export interface DirectoryResultCardProps {
  name: string
  matchedLabel: string
  matchedValue: string
  onRequestContact: () => Promise<void>
}

export function DirectoryResultCard({ name, matchedLabel, matchedValue, onRequestContact }: DirectoryResultCardProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  async function handleClick() {
    setStatus('sending')
    try {
      await onRequestContact()
      setStatus('sent')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <Card surface="outlined" className="flex items-center justify-between gap-4">
      <div>
        <Text className="font-medium">{name}</Text>
        <Text tone="muted" size="sm">
          {matchedLabel}: {matchedValue}
        </Text>
      </div>
      {status === 'sent' ? (
        <Text size="sm" className="flex items-center gap-1.5 text-success">
          <Check aria-hidden className="h-4 w-4" />
          Requested
        </Text>
      ) : (
        <Button size="sm" loading={status === 'sending'} onClick={handleClick}>
          Request Contact
        </Button>
      )}
    </Card>
  )
}
