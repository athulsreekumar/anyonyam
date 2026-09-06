import { beforeEach, describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { App } from './App'
import { renderWithProviders } from '@/test/renderWithProviders'
import { writeAuth } from '@/lib/authStorage'

function renderAt(path: string) {
  return renderWithProviders(<App />, { route: path })
}

describe('App routing', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the home page at /', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders the history page at /about/history', () => {
    renderAt('/about/history')
    expect(screen.getByRole('heading', { name: 'History' })).toBeInTheDocument()
  })

  it('renders the today page at /about/today', () => {
    renderAt('/about/today')
    expect(screen.getByRole('heading', { name: 'Anyonyam Today' })).toBeInTheDocument()
  })

  it('renders the gallery page at /gallery', () => {
    renderAt('/gallery')
    expect(screen.getByRole('heading', { name: 'Gallery' })).toBeInTheDocument()
  })

  it('renders the contact page at /contact', () => {
    renderAt('/contact')
    expect(screen.getByRole('heading', { name: 'Visit or Reach Out' })).toBeInTheDocument()
  })

  it('renders the login page at /login', () => {
    renderAt('/login')
    expect(screen.getByRole('heading', { name: 'Hello!' })).toBeInTheDocument()
  })

  it('redirects /profile/:memberNo to /login when signed out', () => {
    renderAt('/profile/3')
    expect(screen.getByRole('heading', { name: 'Hello!' })).toBeInTheDocument()
  })

  it('renders the profile page at /profile/:memberNo when signed in', async () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    renderAt('/profile/3')
    expect(await screen.findByRole('heading', { name: 'Family Profile' })).toBeInTheDocument()
  })

  it('renders the directory page at /directory when signed in', async () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    renderAt('/directory')
    expect(await screen.findByRole('heading', { name: 'Member Directory' })).toBeInTheDocument()
  })

  it('renders the requests page at /requests when signed in', async () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    renderAt('/requests')
    expect(await screen.findByRole('heading', { name: 'Contact Requests' })).toBeInTheDocument()
  })

  it('redirects /directory to /login when signed out', () => {
    renderAt('/directory')
    expect(screen.getByRole('heading', { name: 'Hello!' })).toBeInTheDocument()
  })

  it('redirects a non-admin away from /admin to their own profile', async () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    renderAt('/admin')
    expect(await screen.findByRole('heading', { name: 'Family Profile' })).toBeInTheDocument()
  })

  it('renders the admin dashboard at /admin for an admin', async () => {
    writeAuth({ token: 't', role: 'admin', memberNo: 1, name: 'Admin' })
    renderAt('/admin')
    expect(await screen.findByRole('heading', { name: 'Admin Panel — Admin' })).toBeInTheDocument()
  })

  it('renders the search page at /search for an admin', async () => {
    writeAuth({ token: 't', role: 'admin', memberNo: 1, name: 'Admin' })
    renderAt('/search')
    expect(await screen.findByRole('heading', { name: 'Member Search' })).toBeInTheDocument()
  })

  it('redirects a non-admin away from /search to their own profile', async () => {
    writeAuth({ token: 't', role: 'user', memberNo: 3, name: 'Dev' })
    renderAt('/search')
    expect(await screen.findByRole('heading', { name: 'Family Profile' })).toBeInTheDocument()
  })

  it('renders the 404 page for an unknown route', () => {
    renderAt('/some/unknown/path')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})
