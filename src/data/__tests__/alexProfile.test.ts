import { describe, it, expect } from 'vitest'
import { alexProfile } from '../alexProfile'
import type { UserProfile } from '@/types'

describe('Alex Profile', () => {
  it('should have correct structure', () => {
    expect(alexProfile).toHaveProperty('name')
    expect(alexProfile).toHaveProperty('grade')
    expect(alexProfile).toHaveProperty('school')
    expect(alexProfile).toHaveProperty('location')
    expect(alexProfile).toHaveProperty('gpa')
    expect(alexProfile).toHaveProperty('interests')
    expect(alexProfile).toHaveProperty('currentDate')
  })

  it('should match Alex persona', () => {
    expect(alexProfile.name).toBe('Alex')
    expect(alexProfile.grade).toBe(10)
    expect(alexProfile.school).toBe('Boston Public School')
    expect(alexProfile.location).toBe('Boston, MA')
    expect(alexProfile.interests).toContain('Environmental Justice')
    expect(alexProfile.interests).toContain('Art')
  })

  it('should be valid UserProfile type', () => {
    const profile: UserProfile = alexProfile
    expect(profile).toBeDefined()
  })
})

