import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GalleryPage } from './GalleryPage'
import { galleryCategories } from '@/content/gallery'

describe('GalleryPage', () => {
  it('renders the page title and every category tab', () => {
    render(<GalleryPage />)
    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
    galleryCategories.forEach((category) => {
      expect(screen.getByRole('tab', { name: category.label })).toBeInTheDocument()
    })
  })
})
