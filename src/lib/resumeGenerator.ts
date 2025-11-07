import type { ResumeData, Experience } from '@/types'
import { alexProfile } from '@/data/alexProfile'

export function generateResumeFromExperiences(experiences: Experience[]): ResumeData {
  // Calculate expected graduation year (assuming 4 years of high school starting in 9th grade)
  const currentYear = new Date().getFullYear()
  const graduationYear = currentYear + (12 - alexProfile.grade)

  // Extract skills from experience tags
  const allTags = experiences.flatMap((exp) => exp.tags)
  const uniqueSkills = Array.from(new Set(allTags))

  // Map experiences to resume format
  const resumeExperiences = experiences.map((exp) => {
    // Extract organization from title if it contains "at" or similar
    let organization = alexProfile.school
    if (exp.title.includes('at')) {
      const parts = exp.title.split('at')
      organization = parts[parts.length - 1].trim()
    } else if (exp.type === 'volunteer') {
      organization = exp.description.match(/at (.*?)(?:,|\.|$)/)?.[1] || 'Community Organization'
    } else if (exp.type === 'work') {
      organization = exp.description.match(/at (.*?)(?:,|\.|$)/)?.[1] || 'Employer'
    }

    return {
      title: exp.title,
      organization,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
    }
  })

  // Extract activities (non-work, non-volunteer experiences)
  const activities = experiences
    .filter((exp) => exp.type === 'activity')
    .map((exp) => exp.title)

  return {
    education: {
      school: alexProfile.school,
      gpa: alexProfile.gpa,
      expectedGraduation: graduationYear.toString(),
    },
    experiences: resumeExperiences,
    skills: uniqueSkills,
    activities,
  }
}

