import { describe, it, expect } from 'vitest'
import { getPersonalizedResources, getMatchReason } from '../personalization'
import { resources } from '@/data/resources'

describe('personalization', () => {
  describe('getPersonalizedResources', () => {
    it('returns recommended and all resources', () => {
      const result = getPersonalizedResources(resources)
      
      expect(result).toHaveProperty('recommended')
      expect(result).toHaveProperty('all')
      expect(Array.isArray(result.recommended)).toBe(true)
      expect(Array.isArray(result.all)).toBe(true)
    })

    it('recommended resources are a subset of all resources', () => {
      const { recommended, all } = getPersonalizedResources(resources)
      
      recommended.forEach((rec) => {
        expect(all).toContainEqual(rec)
      })
    })

    it('recommended resources are prioritized', () => {
      const { recommended } = getPersonalizedResources(resources)
      
      // Should have some recommended resources (at least for Environmental Justice and Art)
      expect(recommended.length).toBeGreaterThan(0)
    })
  })

  describe('getMatchReason', () => {
    it('returns a match reason for a resource', () => {
      const resource = resources[0]
      const reason = getMatchReason(resource)
      
      expect(typeof reason).toBe('string')
      expect(reason.length).toBeGreaterThan(0)
    })

    it('returns default reason if no match found', () => {
      const resource = {
        id: 'test',
        title: 'Test Resource',
        type: 'scholarship' as const,
        description: 'Test',
        deadline: null,
        eligibility: [],
        link: null,
        tags: ['Unrelated'],
      }
      
      const reason = getMatchReason(resource)
      expect(reason).toBe('Recommended for you')
    })
  })
})

