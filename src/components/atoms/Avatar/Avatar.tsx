import { useState } from 'react'
import { UserRound } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva(
  'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-maroon-100 text-maroon-700',
  {
    variants: {
      size: {
        sm: 'h-9 w-9',
        md: 'h-14 w-14',
        lg: 'h-24 w-24',
      },
    },
    defaultVariants: { size: 'md' },
  },
)

export interface AvatarProps extends VariantProps<typeof avatarVariants> {
  src?: string | null
  alt: string
  className?: string
}

export function Avatar({ src, alt, size, className }: AvatarProps) {
  const [errored, setErrored] = useState(false)
  const showImage = src && !errored

  return (
    <span
      className={cn(avatarVariants({ size }), className)}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : alt}
    >
      {showImage ? (
        <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setErrored(true)} />
      ) : (
        <UserRound aria-hidden className="h-1/2 w-1/2" />
      )}
    </span>
  )
}
