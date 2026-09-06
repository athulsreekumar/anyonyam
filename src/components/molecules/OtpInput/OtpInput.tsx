import { useRef } from 'react'
import type { ClipboardEvent, KeyboardEvent } from 'react'
import { cn } from '@/lib/cn'

export interface OtpInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  invalid?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

/**
 * A row of single-digit boxes that behaves as one 6-digit field: typing
 * advances focus, backspace on an empty box steps back, and pasting a full
 * code fills every box at once.
 */
export function OtpInput({ length = 6, value, onChange, invalid, disabled, autoFocus }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  function setDigit(index: number, digit: string) {
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, length))
  }

  function handleChange(index: number, raw: string) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    setDigit(index, digit)
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    if (!pasted) return
    e.preventDefault()
    onChange(pasted)
    const lastIndex = Math.min(pasted.length, length) - 1
    inputRefs.current[lastIndex]?.focus()
  }

  return (
    <fieldset className="m-0 flex gap-2 border-0 p-0">
      <legend className="sr-only">One-time passcode</legend>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          disabled={disabled}
          autoFocus={autoFocus && index === 0}
          aria-label={`Digit ${index + 1} of ${length}`}
          aria-invalid={invalid || undefined}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className={cn(
            'h-14 w-11 rounded-md border border-charcoal-600/25 bg-cream-50 text-center font-display text-xl text-charcoal-900',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon-500',
            invalid && 'border-error focus-visible:outline-error',
          )}
        />
      ))}
    </fieldset>
  )
}
