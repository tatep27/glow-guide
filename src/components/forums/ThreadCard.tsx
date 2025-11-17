import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, ThumbsUp } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useViewMode } from '@/hooks/useViewMode'
import { getAuthorDisplayName } from '@/lib/forumUtils'
import type { ForumThread } from '@/types'

interface ThreadCardProps {
  thread: ForumThread
  onClick: () => void
}

export function ThreadCard({ thread, onClick }: ThreadCardProps) {
  const postCount = thread.posts.length
  const totalLikes = thread.posts.reduce((sum, post) => sum + post.likes, 0)
  const lastActivity = parseISO(thread.lastActivity)

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/30"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-semibold text-lg flex-1">{thread.title}</h3>
            <Badge variant={thread.isCounselor ? 'default' : 'secondary'} className="text-xs">
              {thread.isCounselor ? 'Counselor' : 'Student'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {thread.posts[0]?.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{postCount} {postCount === 1 ? 'reply' : 'replies'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              <span>{totalLikes}</span>
            </div>
            <span>{formatDistanceToNow(lastActivity, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

