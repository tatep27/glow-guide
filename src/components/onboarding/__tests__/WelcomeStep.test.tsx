import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WelcomeStep } from '../WelcomeStep'

describe('WelcomeStep', () => {
  it('renders welcome message', () => {
    const onNext = vi.fn()
    render(<WelcomeStep onNext={onNext} />)
    
    expect(screen.getByText(/Welcome to Career Readiness Platform/i)).toBeInTheDocument()
  })

  it('calls onNext when Get Started button is clicked', async () => {
    const user = userEvent.setup()
    const onNext = vi.fn()
    render(<WelcomeStep onNext={onNext} />)
    
    const button = screen.getByRole('button', { name: /Get Started/i })
    await user.click(button)
    
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('displays platform features', () => {
    const onNext = vi.fn()
    render(<WelcomeStep onNext={onNext} />)
    
    expect(screen.getByText(/personalized timeline/i)).toBeInTheDocument()
    expect(screen.getByText(/Resource suggestions/i)).toBeInTheDocument()
    expect(screen.getByText(/resume builder/i)).toBeInTheDocument()
    expect(screen.getByText(/Community forums/i)).toBeInTheDocument()
  })
})

