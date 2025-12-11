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
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          {title}
        </h2>
        <Badge variant="secondary" className="text-base px-3 py-1">{resources.length}</Badge>
      </div>
      <div className="flex flex-col gap-6 w-full">
        {resources.map((resource) => (
          <div key={resource.id} className="relative w-full">
            {showMatchReason && (
              <div className="absolute -top-3 left-4 z-10">
                <Badge className="bg-primary text-primary-foreground text-xs shadow-lg">
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

