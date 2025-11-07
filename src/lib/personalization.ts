import type { Resource } from '@/types'
import { alexProfile } from '@/data/alexProfile'
import { diagnosticResults } from '@/data/diagnosticResults'
import { experiences } from '@/data/experiences'

export function getPersonalizedResources(resources: Resource[]): {
  recommended: Resource[]
  all: Resource[]
} {
  const userInterests = alexProfile.interests
  const diagnosticScores = diagnosticResults.scores
  const experienceTags = experiences.flatMap((exp) => exp.tags)

  // Calculate match scores for each resource
  const scoredResources = resources.map((resource) => {
    let score = 0

    // Match by tags
    resource.tags.forEach((tag) => {
      // Direct interest match
      if (userInterests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))) {
        score += 10
      }
      // Diagnostic score match
      if (diagnosticScores[tag]) {
        score += diagnosticScores[tag] / 10
      }
      // Experience tag match
      if (experienceTags.includes(tag)) {
        score += 5
      }
    })

    // Location match (Boston/Massachusetts)
    if (resource.location && (resource.location.includes('Boston') || resource.location.includes('Massachusetts'))) {
      score += 3
    }

    // Type-specific bonuses
    if (resource.type === 'scholarship' && userInterests.some((i) => i.includes('Art') || i.includes('Environmental'))) {
      score += 2
    }

    return { resource, score }
  })

  // Sort by score (highest first)
  scoredResources.sort((a, b) => b.score - a.score)

  // Recommended: top 6 resources with score > 0
  const recommended = scoredResources
    .filter((item) => item.score > 0)
    .slice(0, 6)
    .map((item) => item.resource)

  return {
    recommended,
    all: resources,
  }
}

export function getMatchReason(resource: Resource): string {
  const userInterests = alexProfile.interests
  const reasons: string[] = []

  // Check tag matches
  resource.tags.forEach((tag) => {
    if (userInterests.some((interest) => tag.toLowerCase().includes(interest.toLowerCase()))) {
      reasons.push(`Matches your interest in ${tag}`)
    }
  })

  // Location match
  if (resource.location && resource.location.includes('Boston')) {
    reasons.push('Local to Boston area')
  }

  // Grade level match (simplified)
  if (resource.type === 'scholarship') {
    reasons.push('Relevant for your grade level')
  }

  return reasons[0] || 'Recommended for you'
}

