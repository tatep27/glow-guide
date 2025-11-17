import { Button } from '@/components/ui/button'
import { ForumCard } from './ForumCard'
import { Plus } from 'lucide-react'
import type { Forum } from '@/types'

interface ForumListViewProps {
  forums: Forum[]
  onForumSelect: (forum: Forum) => void
  showCreateButton?: boolean
  onCreateForum?: () => void
}

export function ForumListView({ forums, onForumSelect, showCreateButton, onCreateForum }: ForumListViewProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-2">Community Forums</h1>
        {showCreateButton && onCreateForum && (
          <Button onClick={onCreateForum}>
            <Plus className="h-4 w-4 mr-2" />
            Create a Forum
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {forums.map((forum) => (
          <ForumCard
            key={forum.id}
            forum={forum}
            onClick={() => onForumSelect(forum)}
          />
        ))}
      </div>
    </div>
  )
}

