import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemberCard } from './MemberCard'
import { memberFixture } from '@/test/fixtures/member'

describe('MemberCard', () => {
  it('renders the name, member number, and illam', () => {
    render(<MemberCard member={memberFixture} onShowMore={() => {}} />)
    expect(screen.getByText('Krishnan Namboodiri')).toBeInTheDocument()
    expect(screen.getByText('Member No: 3')).toBeInTheDocument()
    expect(screen.getByText('Vadakkumkoor Mana')).toBeInTheDocument()
  })

  it('calls onShowMore when clicked', async () => {
    const onShowMore = vi.fn()
    render(<MemberCard member={memberFixture} onShowMore={onShowMore} />)
    await userEvent.click(screen.getByRole('button', { name: 'Show More' }))
    expect(onShowMore).toHaveBeenCalledTimes(1)
  })
})
