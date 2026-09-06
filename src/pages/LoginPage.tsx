import { useState } from 'react'
import type { FormEvent } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/atoms/Button'
import { Input } from '@/components/atoms/Input'
import { Heading } from '@/components/atoms/Heading'
import { Text } from '@/components/atoms/Text'
import { Logo } from '@/components/atoms/Logo'
import { FormField } from '@/components/molecules/FormField'
import { OtpInput } from '@/components/molecules/OtpInput'
import { api } from '@/lib/apiClient'
import { useAuth } from '@/auth/AuthContext'
import { useToast } from '@/components/molecules/Toast'

const PHONE_LENGTH = 10
const OTP_LENGTH = 6

interface LoginResponse {
  token: string
  role: 'admin' | 'user'
  name: string
  memberNo: number
}

function errorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError<{ error?: string }>(err)) {
    return err.response?.data?.error ?? fallback
  }
  return fallback
}

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [otpError, setOtpError] = useState('')
  const [requestingOtp, setRequestingOtp] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const isValidPhone = /^\d{10}$/.test(phone)

  async function handleRequestOtp(e: FormEvent) {
    e.preventDefault()
    if (!isValidPhone) {
      setPhoneError(`Please enter a valid ${PHONE_LENGTH}-digit phone number`)
      return
    }
    setPhoneError('')
    setRequestingOtp(true)
    try {
      await api.post('/login', { phone })
      setStep('otp')
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setPhoneError('Phone number not found. Please contact admin.')
      } else if (axios.isAxiosError(err) && err.response?.status === 429) {
        showToast('Too many attempts. Please wait a few minutes and try again.', 'warning')
      } else {
        showToast(errorMessage(err, 'Something went wrong. Please try again.'), 'error')
      }
    } finally {
      setRequestingOtp(false)
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault()
    if (otp.length !== OTP_LENGTH) {
      setOtpError(`Enter the ${OTP_LENGTH}-digit code we sent you`)
      return
    }
    setVerifying(true)
    try {
      const { data } = await api.post<LoginResponse>('/auth', { phone, otp })
      login({ token: data.token, role: data.role, memberNo: data.memberNo, name: data.name })
      navigate(`/profile/${data.memberNo}`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 429) {
        showToast('Too many attempts. Please wait a few minutes and try again.', 'warning')
      } else {
        setOtpError(errorMessage(err, "That code didn't work. Please try again."))
      }
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-6 px-4 py-24 text-center">
      <Logo size="lg" />
      <div>
        <Heading level="h2">Hello!</Heading>
        <Text tone="muted" className="mt-1">
          {step === 'phone' ? 'Enter your member phone number to sign in.' : 'Enter the code we texted you.'}
        </Text>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleRequestOtp} className="w-full text-left" noValidate>
          <FormField label="Phone number" error={phoneError}>
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, PHONE_LENGTH))}
              autoFocus
            />
          </FormField>
          <Button type="submit" loading={requestingOtp} className="mt-4 w-full">
            Get OTP
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="flex w-full flex-col items-center gap-4" noValidate>
          <OtpInput
            value={otp}
            onChange={(value) => {
              setOtp(value)
              setOtpError('')
            }}
            invalid={Boolean(otpError)}
            autoFocus
          />
          {otpError && (
            <Text size="sm" role="alert" className="text-error">
              {otpError}
            </Text>
          )}
          <Button type="submit" loading={verifying} className="w-full">
            Submit OTP
          </Button>
          <button
            type="button"
            onClick={() => {
              setStep('phone')
              setOtp('')
              setOtpError('')
            }}
            className="font-body text-sm text-charcoal-600 underline hover:text-maroon-700"
          >
            Use a different number
          </button>
        </form>
      )}
    </div>
  )
}
