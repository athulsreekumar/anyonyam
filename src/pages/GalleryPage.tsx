import { SectionHeading } from '@/components/molecules/SectionHeading'
import { GalleryGrid } from '@/components/organisms/GalleryGrid'
import { galleryCategories } from '@/content/gallery'

export function GalleryPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Moments" title="Gallery" description="Photos from Anyonyam's events over the years." />
      <div className="mt-10">
        <GalleryGrid categories={galleryCategories} />
      </div>
    </section>
  )
}
