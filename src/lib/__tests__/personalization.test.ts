import { describe, it, expect } from 'vitest'
import { getPersonalizedResources, getMatchReason } from '../personalization'
import { resources } from '@/data/resources'
import { experiences } from '@/data/experiences'

describe('personalization', () => {
  describe('getPersonalizedResources', () => {
    it('returns recommended and all resources', () => {
      const result = getPersonalizedResources(resources, experiences)
      
      expect(result).toHaveProperty('recommended')
      expect(result).toHaveProperty('all')
      expect(Array.isArray(result.recommended)).toBe(true)
      expect(Array.isArray(result.all)).toBe(true)
    })

    it('recommended resources are a subset of all resources', () => {
      const { recommended, all } = getPersonalizedResources(resources, experiences)
      
      recommended.forEach((rec) => {
        expect(all).toContainEqual(rec)
      })
    })

    it('recommended resources are prioritized', () => {
      const { recommended } = getPersonalizedResources(resources, experiences)
      
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

    it('returns a reason for any resource', () => {
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
      // Should return some reason (could be grade level match or default)
      expect(typeof reason).toBe('string')
      expect(reason.length).toBeGreaterThan(0)
    })
  })
})

