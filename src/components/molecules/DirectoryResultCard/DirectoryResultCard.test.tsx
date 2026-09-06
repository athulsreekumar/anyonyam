import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DirectoryResultCard } from './DirectoryResultCard'

describe('DirectoryResultCard', () => {
  it('renders the name and matched field', () => {
    render(<DirectoryResultCard name="K K Devadas" matchedLabel="Profession" matchedValue="Doctor" onRequestContact={async () => {}} />)
    expect(screen.getByText('K K Devadas')).toBeInTheDocument()
    expect(screen.getByText('Profession: Doctor')).toBeInTheDocument()
  })

  it('calls onRequestContact and shows a confirmation on success', async () => {
    const onRequestContact = vi.fn().mockResolvedValue(undefined)
    render(<DirectoryResultCard name="K K Devadas" matchedLabel="Profession" matchedValue="Doctor" onRequestContact={onRequestContact} />)

    await userEvent.click(screen.getByRole('button', { name: 'Request Contact' }))

    expect(onRequestContact).toHaveBeenCalledTimes(1)
    expect(await screen.findByText('Requested')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Request Contact' })).not.toBeInTheDocument()
  })

  it('resets to idle if the request fails', async () => {
    const onRequestContact = vi.fn().mockRejectedValue(new Error('boom'))
    render(<DirectoryResultCard name="K K Devadas" matchedLabel="Profession" matchedValue="Doctor" onRequestContact={onRequestContact} />)

    await userEvent.click(screen.getByRole('button', { name: 'Request Contact' }))

    expect(await screen.findByRole('button', { name: 'Request Contact' })).toBeInTheDocument()
  })
})
