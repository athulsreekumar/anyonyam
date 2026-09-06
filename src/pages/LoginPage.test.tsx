import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { AuthProvider } from '@/auth/AuthContext'
import { ToastProvider } from '@/components/molecules/Toast'
import { server } from '@/test/mocks/server'

function renderLoginPage() {
  return render(
    <AuthProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile/:memberNo" element={<p>Profile for member</p>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </AuthProvider>,
  )
}

async function fillOtp(digits: string) {
  const boxes = screen.getAllByRole('textbox', { name: /Digit \d of 6/ })
  await userEvent.click(boxes[0]!)
  await userEvent.paste(digits)
}

describe('LoginPage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('rejects an incomplete phone number before calling the API', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '123')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    expect(await screen.findByText('Please enter a valid 10-digit phone number')).toBeInTheDocument()
  })

  it('moves to the OTP step after a valid phone number is submitted', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    expect(await screen.findByText('Enter the code we texted you.')).toBeInTheDocument()
  })

  it('shows a specific error when the phone number is not registered', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '0000000000')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    expect(await screen.findByText('Phone number not found. Please contact admin.')).toBeInTheDocument()
  })

  it('logs in and navigates to the profile page on a correct OTP', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    await screen.findByText('Enter the code we texted you.')

    await fillOtp('123456')
    await userEvent.click(screen.getByRole('button', { name: 'Submit OTP' }))

    expect(await screen.findByText('Profile for member')).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem('anyonyam.auth')!)).toMatchObject({ memberNo: 3 })
  })

  it('shows an error and stays on the OTP step for a wrong code', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    await screen.findByText('Enter the code we texted you.')

    await fillOtp('000000')
    await userEvent.click(screen.getByRole('button', { name: 'Submit OTP' }))

    expect(await screen.findByText('OTP is invalid or has expired. Please request a new one.')).toBeInTheDocument()
  })

  it('lets the user go back and re-enter the phone number', async () => {
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    await screen.findByText('Enter the code we texted you.')

    await userEvent.click(screen.getByRole('button', { name: 'Use a different number' }))
    expect(await screen.findByText('Enter your member phone number to sign in.')).toBeInTheDocument()
  })

  it('shows a toast on a rate-limited login request', async () => {
    server.use(
      http.post('http://localhost:8800/login', () => HttpResponse.json({ error: 'Too many requests' }, { status: 429 })),
    )
    renderLoginPage()
    await userEvent.type(screen.getByLabelText('Phone number'), '9876543210')
    await userEvent.click(screen.getByRole('button', { name: 'Get OTP' }))
    expect(await screen.findByText('Too many attempts. Please wait a few minutes and try again.')).toBeInTheDocument()
  })
})
