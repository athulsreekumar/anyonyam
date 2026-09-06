import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { IconButton } from '@/components/atoms/IconButton'
import type { GalleryCategory } from '@/content/gallery'

export interface GalleryLightboxProps {
  photos: GalleryCategory['photos']
  index: number
  onIndexChange: (index: number) => void
  onClose: () => void
}

export function GalleryLightbox({ photos, index, onIndexChange, onClose }: GalleryLightboxProps) {
  const photo = photos[index]
  if (!photo) return null

  const goPrev = () => onIndexChange((index - 1 + photos.length) % photos.length)
  const goNext = () => onIndexChange((index + 1) % photos.length)

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-maroon-900/90" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') goPrev()
            if (e.key === 'ArrowRight') goNext()
          }}
        >
          <Dialog.Title className="sr-only">
            {photo.alt} ({index + 1} of {photos.length})
          </Dialog.Title>
          <Dialog.Close asChild>
            <IconButton aria-label="Close gallery" tone="onDark" className="absolute top-4 right-4">
              <X aria-hidden className="h-6 w-6" />
            </IconButton>
          </Dialog.Close>

          <div className="flex w-full max-w-4xl items-center justify-between gap-4">
            <IconButton aria-label="Previous photo" tone="onDark" onClick={goPrev}>
              <ChevronLeft aria-hidden className="h-7 w-7" />
            </IconButton>
            <img
              src={photo.src}
              alt={photo.alt}
              className="max-h-[75vh] max-w-full rounded-md object-contain shadow-lifted"
            />
            <IconButton aria-label="Next photo" tone="onDark" onClick={goNext}>
              <ChevronRight aria-hidden className="h-7 w-7" />
            </IconButton>
          </div>

          <p className="font-body text-sm text-cream-50/70">
            {index + 1} / {photos.length}
          </p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
