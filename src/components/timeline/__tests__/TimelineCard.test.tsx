import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TimelineCard } from '../TimelineCard'
import type { Experience, Resource } from '@/types'

describe('TimelineCard', () => {
  const mockExperience: Experience = {
    id: 'exp-1',
    title: 'Test Experience',
    description: 'Test description',
    startDate: '2023-09-01',
    endDate: null,
    tags: ['test'],
    type: 'activity',
    gradeLevel: 9,
    emoji: '🎨',
  }

  const mockResource: Resource = {
    id: 'res-1',
    title: 'Test Resource',
    type: 'scholarship',
    description: 'Test resource description',
    deadline: '2025-03-01',
    eligibility: [],
    link: null,
    tags: ['test'],
  }

  it('renders experience card with emoji', () => {
    render(<TimelineCard type="experience" data={mockExperience} />)
    expect(screen.getByText('Test Experience')).toBeInTheDocument()
    expect(screen.getByText('🎨')).toBeInTheDocument()
  })

  it('renders resource card with appropriate emoji', () => {
    render(<TimelineCard type="resource" data={mockResource} />)
    expect(screen.getByText('Test Resource')).toBeInTheDocument()
    expect(screen.getByText('💰')).toBeInTheDocument()
  })

  it('calls onClick when experience card is clicked', () => {
    const handleClick = vi.fn()
    render(<TimelineCard type="experience" data={mockExperience} onClick={handleClick} />)
    
    const card = screen.getByText('Test Experience').closest('div[class*="cursor-pointer"]') as HTMLElement
    if (card) {
      card.click()
    }
    
    expect(handleClick).toHaveBeenCalled()
  })

  it('calls onResourceClick when resource card is clicked', () => {
    const handleResourceClick = vi.fn()
    render(<TimelineCard type="resource" data={mockResource} onResourceClick={handleResourceClick} />)
    
    const card = screen.getByText('Test Resource').closest('div[class*="cursor-pointer"]') as HTMLElement
    if (card) {
      card.click()
    }
    
    expect(handleResourceClick).toHaveBeenCalledWith(mockResource)
  })
})

