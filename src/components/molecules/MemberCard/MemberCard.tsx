import { Avatar } from '@/components/atoms/Avatar'
import { Text } from '@/components/atoms/Text'
import { Card } from '@/components/molecules/Card'
import { env } from '@/lib/env'
import type { Member } from '@/types/member'

export interface MemberCardProps {
  member: Member
  onShowMore: () => void
}

export function MemberCard({ member, onShowMore }: MemberCardProps) {
  return (
    <Card surface="tinted" className="flex flex-col items-center gap-3 text-center">
      <Avatar src={`${env.apiBaseUrl}/image/${member.UNIQUEID}`} alt={member.Name} size="lg" />
      <div>
        <Text className="font-medium">{member.Name}</Text>
        <Text tone="muted" size="sm">
          Member No: {member.MemberNo}
        </Text>
        {member.Illam && (
          <Text tone="muted" size="sm">
            {member.Illam}
          </Text>
        )}
      </div>
      <button
        type="button"
        onClick={onShowMore}
        className="font-body text-sm font-medium text-maroon-700 underline hover:text-maroon-900"
      >
        Show More
      </button>
    </Card>
  )
}
