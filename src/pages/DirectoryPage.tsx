import { SectionHeading } from '@/components/molecules/SectionHeading'
import { DirectorySearch } from '@/components/organisms/DirectorySearch'

export function DirectoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Member Area"
        title="Member Directory"
        description="Find a fellow member by profession, or find a blood donor. Contact details stay private until the person you find approves your request."
      />
      <div className="mt-10">
        <DirectorySearch />
      </div>
    </div>
  )
}
