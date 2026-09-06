export interface GalleryCategory {
  slug: string
  label: string
  photos: { src: string; alt: string }[]
}

function buildPhotos(slug: string, label: string, count: number): { src: string; alt: string }[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0')
    return { src: `/gallery/${slug}/${slug}-${n}.jpg`, alt: `${label} photo ${i + 1}` }
  })
}

export const galleryCategories: GalleryCategory[] = [
  { slug: 'varshikam', label: 'Varshikam', photos: buildPhotos('varshikam', 'Varshikam', 16) },
  { slug: 'football', label: 'Football Mela', photos: buildPhotos('football', 'Football Mela', 11) },
  {
    slug: 'pathana-shibiram',
    label: 'Padana Sibiram',
    photos: buildPhotos('pathana-shibiram', 'Padana Sibiram', 7),
  },
]
