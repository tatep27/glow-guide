import { ForumCard } from './ForumCard'
import type { Forum } from '@/types'

interface ForumListViewProps {
  forums: Forum[]
  onForumSelect: (forum: Forum) => void
}

export function ForumListView({ forums, onForumSelect }: ForumListViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Community Forums</h1>
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

