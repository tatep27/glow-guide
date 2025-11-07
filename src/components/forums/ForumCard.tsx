import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users } from 'lucide-react'
import type { Forum } from '@/types'

interface ForumCardProps {
  forum: Forum
  onClick: () => void
}

export function ForumCard({ forum, onClick }: ForumCardProps) {
  const totalThreads = forum.threads.length
  const totalPosts = forum.threads.reduce((sum, thread) => sum + thread.posts.length, 0)

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all border-2 hover:border-primary/50"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">{forum.title}</CardTitle>
            <CardDescription className="text-base">{forum.description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span>{totalThreads} {totalThreads === 1 ? 'thread' : 'threads'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{totalPosts} {totalPosts === 1 ? 'post' : 'posts'}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Created by {forum.createdBy}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

