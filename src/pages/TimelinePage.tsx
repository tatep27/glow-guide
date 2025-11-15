import { useState } from 'react'
import { Timeline } from '@/components/timeline/Timeline'
import { ExperienceDetailModal } from '@/components/timeline/ExperienceDetailModal'
import { ResourceDetail } from '@/components/resources/ResourceDetail'
import { X } from 'lucide-react'
import { experiences } from '@/data/experiences'
import { resources } from '@/data/resources'
import type { Experience, Resource } from '@/types'

export function TimelinePage() {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  const handleExperienceClick = (experience: Experience) => {
    setSelectedExperience(experience)
  }

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }

  return (
    <div className="space-y-6">
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

      {selectedResource && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedResource(null)}>
          <div className="bg-background rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 relative">
              <button
                onClick={() => setSelectedResource(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-2 hover:bg-muted rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
              <ResourceDetail resource={selectedResource} onClose={() => setSelectedResource(null)} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

