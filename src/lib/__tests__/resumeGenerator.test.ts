import { describe, it, expect } from 'vitest'
import { generateResumeFromExperiences } from '../resumeGenerator'
import { experiences } from '@/data/experiences'

describe('resumeGenerator', () => {
  describe('generateResumeFromExperiences', () => {
    it('generates resume with correct structure', () => {
      const resume = generateResumeFromExperiences(experiences)

      expect(resume).toHaveProperty('education')
      expect(resume).toHaveProperty('experiences')
      expect(resume).toHaveProperty('skills')
      expect(resume).toHaveProperty('activities')
    })

    it('includes education information', () => {
      const resume = generateResumeFromExperiences(experiences)

      expect(resume.education.school).toBe('Boston Public School')
      expect(resume.education.gpa).toBe(3.7)
      expect(resume.education.expectedGraduation).toBeTruthy()
    })

    it('maps experiences correctly', () => {
      const resume = generateResumeFromExperiences(experiences)

      expect(resume.experiences.length).toBe(experiences.length)
      expect(resume.experiences[0]).toHaveProperty('title')
      expect(resume.experiences[0]).toHaveProperty('organization')
      expect(resume.experiences[0]).toHaveProperty('description')
    })

    it('extracts skills from experience tags', () => {
      const resume = generateResumeFromExperiences(experiences)

      expect(resume.skills.length).toBeGreaterThan(0)
      expect(resume.skills).toContain('Environmental Justice')
      expect(resume.skills).toContain('Art')
    })

    it('extracts activities from activity-type experiences', () => {
      const resume = generateResumeFromExperiences(experiences)

      const activityExperiences = experiences.filter((e) => e.type === 'activity')
      expect(resume.activities.length).toBe(activityExperiences.length)
    })
  })
})

