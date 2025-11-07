import { describe, it, expect } from 'vitest'
import { formatDate, formatDateRange, getDeadlineUrgency } from '../dateUtils'

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats date correctly', () => {
      expect(formatDate('2024-10-15')).toBe('Oct 2024')
      expect(formatDate('2025-03-01')).toBe('Mar 2025')
    })
  })

  describe('formatDateRange', () => {
    it('formats date range with end date', () => {
      expect(formatDateRange('2024-01-01', '2024-12-31')).toBe('Jan 2024 - Dec 2024')
    })

    it('formats date range with null end date as Present', () => {
      expect(formatDateRange('2024-01-01', null)).toBe('Jan 2024 - Present')
    })
  })

  describe('getDeadlineUrgency', () => {
    it('returns urgent for deadlines within 30 days', () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 15)
      expect(getDeadlineUrgency(soonDate.toISOString().split('T')[0])).toBe('urgent')
    })

    it('returns soon for deadlines within 90 days', () => {
      const soonDate = new Date()
      soonDate.setDate(soonDate.getDate() + 60)
      expect(getDeadlineUrgency(soonDate.toISOString().split('T')[0])).toBe('soon')
    })

    it('returns upcoming for deadlines beyond 90 days', () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 120)
      expect(getDeadlineUrgency(futureDate.toISOString().split('T')[0])).toBe('upcoming')
    })

    it('returns null for null deadline', () => {
      expect(getDeadlineUrgency(null)).toBeNull()
    })
  })
})

