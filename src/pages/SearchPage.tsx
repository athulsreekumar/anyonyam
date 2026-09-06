import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { useToast } from '@/components/molecules/Toast'
import { api } from '@/lib/apiClient'
import type { Member } from '@/types/member'

export function SearchPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const [name, setName] = useState('')
  const [results, setResults] = useState<Member[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setLoading(true)
    try {
      const { data } = await api.get<Member[]>('/search', { params: { name: trimmed } })
      setResults(data)
      setSearched(true)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setResults([])
        setSearched(true)
      } else {
        showToast('The server is having trouble right now. Please try again.', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Member Area" title="Member Search" />

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Search by name"
          aria-label="Search by name"
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          <SearchIcon aria-hidden className="h-4 w-4" />
          Go
        </Button>
      </form>

      <div className="mt-8 flex flex-col gap-3">
        {searched && results.length === 0 && <Text tone="muted">No members found.</Text>}
        {results.map((member) => (
          <Card
            key={member.UNIQUEID}
            surface="outlined"
            role="button"
            tabIndex={0}
            className="cursor-pointer transition-colors hover:bg-maroon-100/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500"
            onClick={() => navigate(`/profile/${member.MemberNo}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(`/profile/${member.MemberNo}`)
              }
            }}
          >
            <Text className="font-medium">Member No: {member.MemberNo}</Text>
            <Text>{member.Name}</Text>
            {member.Illam && (
              <Text tone="muted" size="sm">
                {member.Illam}
              </Text>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
