import { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { Text } from '@/components/atoms/Text'
import { SectionHeading } from '@/components/molecules/SectionHeading'
import { MemberCard } from '@/components/molecules/MemberCard'
import { ProfileDetailModal } from '@/components/organisms/ProfileDetailModal'
import { AddFamilyMemberModal } from '@/components/organisms/AddFamilyMemberModal'
import { useToast } from '@/components/molecules/Toast'
import { useAuth } from '@/auth/AuthContext'
import { api } from '@/lib/apiClient'
import type { Member } from '@/types/member'

interface ProfileResponse {
  data: Member[]
  isAdmin: boolean
  userMemberNo: number
}

export function ProfilePage() {
  const { memberNo } = useParams<{ memberNo: string }>()
  const { isAdmin, memberNo: authMemberNo } = useAuth()
  const { showToast } = useToast()

  const canManage = isAdmin || Number(memberNo) === authMemberNo

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Member | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  const fetchProfile = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await api.get<ProfileResponse>('/profile', { params: { MemberNo: memberNo } })
      setMembers(data.data)
    } catch {
      showToast("Couldn't load this profile. Please try again.", 'error')
    } finally {
      setLoading(false)
    }
  }, [memberNo, showToast])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Member Area"
        title="Family Profile"
        action={
          canManage && (
            <Button onClick={() => setAddOpen(true)}>
              <Plus aria-hidden className="h-4 w-4" />
              Add Family Member
            </Button>
          )
        }
      />

      {members.length === 0 ? (
        <Text tone="muted" className="mt-10">
          No members found.
        </Text>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((member) => (
            <MemberCard key={member.UNIQUEID} member={member} onShowMore={() => setSelected(member)} />
          ))}
        </div>
      )}

      {selected && (
        <ProfileDetailModal
          member={selected}
          open={Boolean(selected)}
          onOpenChange={(open) => !open && setSelected(null)}
          canManage={canManage}
          onUpdated={() => {
            setSelected(null)
            fetchProfile()
          }}
          onDeleted={() => {
            setSelected(null)
            fetchProfile()
          }}
        />
      )}

      {canManage && memberNo && (
        <AddFamilyMemberModal
          memberNo={Number(memberNo)}
          open={addOpen}
          onOpenChange={setAddOpen}
          onAdded={() => fetchProfile()}
        />
      )}
    </div>
  )
}
