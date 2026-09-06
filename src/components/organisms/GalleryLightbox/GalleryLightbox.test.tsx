import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GalleryLightbox } from './GalleryLightbox'

const photos = [
  { src: '/gallery/varshikam/varshikam-01.jpg', alt: 'Varshikam photo 1' },
  { src: '/gallery/varshikam/varshikam-02.jpg', alt: 'Varshikam photo 2' },
  { src: '/gallery/varshikam/varshikam-03.jpg', alt: 'Varshikam photo 3' },
]

describe('GalleryLightbox', () => {
  it('shows the photo at the current index and its position', () => {
    render(<GalleryLightbox photos={photos} index={0} onIndexChange={() => {}} onClose={() => {}} />)
    expect(screen.getByRole('img', { name: 'Varshikam photo 1' })).toBeInTheDocument()
    expect(screen.getByText('1 / 3')).toBeInTheDocument()
  })

  it('wraps to the last photo when going previous from the first', async () => {
    const onIndexChange = vi.fn()
    render(<GalleryLightbox photos={photos} index={0} onIndexChange={onIndexChange} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Previous photo' }))
    expect(onIndexChange).toHaveBeenCalledWith(2)
  })

  it('wraps to the first photo when going next from the last', async () => {
    const onIndexChange = vi.fn()
    render(<GalleryLightbox photos={photos} index={2} onIndexChange={onIndexChange} onClose={() => {}} />)
    await userEvent.click(screen.getByRole('button', { name: 'Next photo' }))
    expect(onIndexChange).toHaveBeenCalledWith(0)
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<GalleryLightbox photos={photos} index={0} onIndexChange={() => {}} onClose={onClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Close gallery' }))
    expect(onClose).toHaveBeenCalled()
  })
})
