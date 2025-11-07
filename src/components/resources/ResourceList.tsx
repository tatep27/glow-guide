import { ResourcePreviewCard } from '@/components/timeline/ResourcePreviewCard'
import { Badge } from '@/components/ui/badge'
import type { Resource } from '@/types'
import { getMatchReason } from '@/lib/personalization'

interface ResourceListProps {
  resources: Resource[]
  title: string
  showMatchReason?: boolean
  onResourceClick: (resource: Resource) => void
}

export function ResourceList({ resources, title, showMatchReason = false, onResourceClick }: ResourceListProps) {
  if (resources.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{title}</h2>
        <Badge variant="secondary">{resources.length}</Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((resource) => (
          <div key={resource.id} className="relative">
            {showMatchReason && (
              <div className="absolute -top-2 left-2 z-10">
                <Badge variant="default" className="text-xs">
                  {getMatchReason(resource)}
                </Badge>
              </div>
            )}
            <ResourcePreviewCard
              resource={resource}
              onClick={() => onResourceClick(resource)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

