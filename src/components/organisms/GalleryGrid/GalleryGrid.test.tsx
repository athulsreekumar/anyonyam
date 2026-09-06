import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GalleryGrid } from './GalleryGrid'
import type { GalleryCategory } from '@/content/gallery'

const categories: GalleryCategory[] = [
  {
    slug: 'varshikam',
    label: 'Varshikam',
    photos: [
      { src: '/gallery/varshikam/varshikam-01.jpg', alt: 'Varshikam photo 1' },
      { src: '/gallery/varshikam/varshikam-02.jpg', alt: 'Varshikam photo 2' },
    ],
  },
  {
    slug: 'football',
    label: 'Football Mela',
    photos: [{ src: '/gallery/football/football-01.jpg', alt: 'Football Mela photo 1' }],
  },
]

describe('GalleryGrid', () => {
  it('shows the first category’s photos by default', () => {
    render(<GalleryGrid categories={categories} />)
    expect(screen.getByRole('img', { name: 'Varshikam photo 1' })).toBeInTheDocument()
  })

  it('switches categories via the tab list', async () => {
    render(<GalleryGrid categories={categories} />)
    await userEvent.click(screen.getByRole('tab', { name: 'Football Mela' }))
    expect(await screen.findByRole('img', { name: 'Football Mela photo 1' })).toBeInTheDocument()
  })

  it('opens the lightbox at the clicked photo', async () => {
    render(<GalleryGrid categories={categories} />)
    await userEvent.click(screen.getByRole('button', { name: /Varshikam photo 2/ }))
    expect(screen.getByText('2 / 2')).toBeInTheDocument()
  })
})
