import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Timeline } from '@/components/timeline/Timeline'
import { ExperienceDetailModal } from '@/components/timeline/ExperienceDetailModal'
import { experiences } from '@/data/experiences'
import { resources } from '@/data/resources'
import { alexProfile } from '@/data/alexProfile'
import type { Experience, Resource } from '@/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)

  const handleExperienceClick = (experience: Experience) => {
    setSelectedExperience(experience)
  }

  const handleResourceClick = (resource: Resource) => {
    // Navigate to resources page with the resource ID
    navigate(`/resources?id=${resource.id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {alexProfile.name}!</h1>
        <p className="text-muted-foreground">
          {alexProfile.grade === 9 && '9th Grade'}
          {alexProfile.grade === 10 && '10th Grade'}
          {alexProfile.grade === 11 && '11th Grade'}
          {alexProfile.grade === 12 && '12th Grade'} • {alexProfile.school}
        </p>
      </div>

      <Timeline
        experiences={experiences}
        resources={resources}
        onExperienceClick={handleExperienceClick}
        onResourceClick={handleResourceClick}
      />

      {selectedExperience && (
        <ExperienceDetailModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  )
}
