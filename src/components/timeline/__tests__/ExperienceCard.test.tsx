import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExperienceCard } from '../ExperienceCard'
import type { Experience } from '@/types'

const mockExperience: Experience = {
  id: 'test-1',
  title: 'Test Experience',
  description: 'This is a test experience description',
  startDate: '2024-01-01',
  endDate: null,
  tags: ['Tag1', 'Tag2', 'Tag3'],
  type: 'activity',
  gradeLevel: 10,
}

describe('ExperienceCard', () => {
  it('renders experience title', () => {
    render(<ExperienceCard experience={mockExperience} />)
    expect(screen.getByText('Test Experience')).toBeInTheDocument()
  })

  it('renders experience description', () => {
    render(<ExperienceCard experience={mockExperience} />)
    expect(screen.getByText(/This is a test experience description/i)).toBeInTheDocument()
  })

  it('renders tags', () => {
    render(<ExperienceCard experience={mockExperience} />)
    expect(screen.getByText('Tag1')).toBeInTheDocument()
    expect(screen.getByText('Tag2')).toBeInTheDocument()
  })

  it('calls onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<ExperienceCard experience={mockExperience} onClick={onClick} />)
    
    const card = screen.getByText('Test Experience').closest('.cursor-pointer')
    if (card) {
      await user.click(card)
      expect(onClick).toHaveBeenCalledTimes(1)
    }
  })

  it('shows Present for ongoing experiences', () => {
    render(<ExperienceCard experience={mockExperience} />)
    expect(screen.getByText(/Present/i)).toBeInTheDocument()
  })
})

