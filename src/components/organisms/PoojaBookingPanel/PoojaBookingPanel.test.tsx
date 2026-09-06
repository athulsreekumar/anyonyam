import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PoojaBookingPanel } from './PoojaBookingPanel'
import { renderWithProviders } from '@/test/renderWithProviders'

async function pickAnAvailableDate() {
  await waitFor(() => expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument())
  const today = new Date()
  const dayInFuture = Math.min(today.getDate() + 1, 27)
  await userEvent.click(screen.getByRole('button', { name: String(dayInFuture) }))
}

describe('PoojaBookingPanel', () => {
  it('requires a pooja type, name and phone before submitting, but not a date', async () => {
    renderWithProviders(<PoojaBookingPanel />)
    await waitFor(() => expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument())

    await userEvent.click(screen.getByRole('button', { name: 'Send Booking Request' }))

    expect(await screen.findByText('Pooja type is required')).toBeInTheDocument()
    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Phone number must be exactly 10 digits')).toBeInTheDocument()
  })

  it('submits successfully without picking a date', async () => {
    renderWithProviders(<PoojaBookingPanel />)
    await waitFor(() => expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument())

    await userEvent.type(screen.getByLabelText('Type of pooja'), 'Ganapathi Homam')
    await userEvent.type(screen.getByLabelText('Your name'), 'Test User')
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')

    await userEvent.click(screen.getByRole('button', { name: 'Send Booking Request' }))

    expect(await screen.findByText(/booking request submitted/i)).toBeInTheDocument()
  })

  it('shows meal and headcount fields only once food is required, with a live cost estimate', async () => {
    renderWithProviders(<PoojaBookingPanel />)
    expect(screen.queryByLabelText('Meal')).not.toBeInTheDocument()

    await userEvent.click(screen.getByLabelText(/food required/i))
    expect(screen.getByLabelText('Meal')).toBeInTheDocument()
    expect(screen.getByLabelText('Meal')).toHaveValue('breakfast')

    await userEvent.type(screen.getByLabelText('Number of people'), '15')
    expect(screen.getByText(/₹1500/)).toBeInTheDocument()
  })

  it('submits a booking request and resets the form on success', async () => {
    renderWithProviders(<PoojaBookingPanel />)
    await pickAnAvailableDate()

    await userEvent.type(screen.getByLabelText('Type of pooja'), 'Ganapathi Homam')
    await userEvent.type(screen.getByLabelText('Your name'), 'Test User')
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')

    await userEvent.click(screen.getByRole('button', { name: 'Send Booking Request' }))

    expect(await screen.findByText(/booking request submitted/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Type of pooja')).toHaveValue('')
  })

  it('pre-fills the requester name for a logged-in member', () => {
    renderWithProviders(<PoojaBookingPanel />, {
      auth: { token: 't', role: 'user', memberNo: 3, name: 'Krishnan Namboodiri' },
    })
    expect(screen.getByLabelText('Your name')).toHaveValue('Krishnan Namboodiri')
  })
})
