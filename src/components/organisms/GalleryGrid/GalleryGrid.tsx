import { useState } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@/lib/cn'
import type { GalleryCategory } from '@/content/gallery'
import { GalleryLightbox } from '@/components/organisms/GalleryLightbox'

export interface GalleryGridProps {
  categories: GalleryCategory[]
}

export function GalleryGrid({ categories }: GalleryGridProps) {
  const firstCategory = categories[0]
  const [activeSlug, setActiveSlug] = useState(firstCategory?.slug ?? '')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const activeCategory = categories.find((c) => c.slug === activeSlug) ?? firstCategory

  if (!activeCategory) return null

  return (
    <Tabs.Root value={activeSlug} onValueChange={setActiveSlug}>
      <Tabs.List aria-label="Gallery categories" className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Tabs.Trigger
            key={category.slug}
            value={category.slug}
            className={cn(
              'rounded-pill px-4 py-2 font-body text-sm font-medium transition-colors duration-150',
              'text-maroon-700 hover:bg-maroon-100 data-[state=active]:bg-maroon-700 data-[state=active]:text-cream-50',
            )}
          >
            {category.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {categories.map((category) => (
        <Tabs.Content key={category.slug} value={category.slug} className="mt-8">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {category.photos.map((photo, i) => (
              <li key={photo.src}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="block aspect-square w-full overflow-hidden rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Tabs.Content>
      ))}

      {openIndex !== null && (
        <GalleryLightbox
          photos={activeCategory.photos}
          index={openIndex}
          onIndexChange={setOpenIndex}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </Tabs.Root>
  )
}
