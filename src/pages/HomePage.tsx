import { HeroSection } from '@/components/organisms/HeroSection'
import { VisionMissionSection } from '@/components/organisms/VisionMissionSection'
import { UpcomingEventBanner } from '@/components/organisms/UpcomingEventBanner'
import { ContactPanel } from '@/components/organisms/ContactPanel'

export function HomePage() {
  return (
    <>
      <HeroSection />
      <VisionMissionSection />
      <UpcomingEventBanner />
      <ContactPanel />
    </>
  )
}
