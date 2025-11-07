import { Badge } from '@/components/ui/badge'
import type { ResourceType } from '@/types'

interface ResourceFilterProps {
  selectedTypes: ResourceType[]
  onTypeToggle: (type: ResourceType) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

const typeLabels: Record<ResourceType, string> = {
  scholarship: 'Scholarships',
  afterschool: 'Programs',
  paid: 'Jobs & Paid',
  'club-fair': 'Club Fairs',
  event: 'Events',
}

const typeIcons: Record<ResourceType, string> = {
  scholarship: '💰',
  afterschool: '🎨',
  paid: '💼',
  'club-fair': '🎪',
  event: '📅',
}

export function ResourceFilter({
  selectedTypes,
  onTypeToggle,
  searchQuery,
  onSearchChange,
}: ResourceFilterProps) {
  const allTypes: ResourceType[] = ['scholarship', 'afterschool', 'paid', 'club-fair', 'event']

  return (
    <div className="space-y-4">
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-background"
        />
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="text-sm font-semibold mb-2">Filter by Type</h3>
        <div className="flex flex-wrap gap-2">
          {allTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)
            return (
              <Badge
                key={type}
                variant={isSelected ? 'default' : 'outline'}
                className="cursor-pointer hover:scale-105 transition-transform px-3 py-1"
                onClick={() => onTypeToggle(type)}
              >
                <span className="mr-1">{typeIcons[type]}</span>
                {typeLabels[type]}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )
}

