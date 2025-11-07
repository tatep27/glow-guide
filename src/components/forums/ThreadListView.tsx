import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ThreadCard } from './ThreadCard'
import type { Forum } from '@/types'

interface ThreadListViewProps {
  forum: Forum
  onBack: () => void
  onThreadSelect: (threadId: string) => void
  onCreateThread: (title: string, content: string) => void
}

export function ThreadListView({ forum, onBack, onThreadSelect, onCreateThread }: ThreadListViewProps) {
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState('')
  const [newThreadContent, setNewThreadContent] = useState('')

  const handleCreateThread = () => {
    if (newThreadTitle.trim() && newThreadContent.trim()) {
      onCreateThread(newThreadTitle.trim(), newThreadContent.trim())
      setNewThreadTitle('')
      setNewThreadContent('')
      setShowNewThread(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={onBack} className="mb-2">
            ← Back to Forums
          </Button>
          <h1 className="text-3xl font-bold">{forum.title}</h1>
          <p className="text-muted-foreground mt-1">{forum.description}</p>
        </div>
        <Button onClick={() => setShowNewThread(!showNewThread)}>
          {showNewThread ? 'Cancel' : '+ New Thread'}
        </Button>
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <Card className="border-2 border-primary/30">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold text-lg">Create New Thread</h3>
            <input
              type="text"
              placeholder="Thread title..."
              value={newThreadTitle}
              onChange={(e) => setNewThreadTitle(e.target.value)}
              className="w-full px-4 py-2 border-2 rounded-lg bg-background"
            />
            <textarea
              placeholder="Write your question or discussion topic..."
              value={newThreadContent}
              onChange={(e) => setNewThreadContent(e.target.value)}
              className="w-full min-h-[120px] p-4 border-2 rounded-lg resize-y bg-background"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateThread} disabled={!newThreadTitle.trim() || !newThreadContent.trim()}>
                Create Thread
              </Button>
              <Button variant="outline" onClick={() => setShowNewThread(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Threads List */}
      <div className="space-y-4">
        {forum.threads.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <p>No threads yet. Be the first to start a discussion!</p>
            </CardContent>
          </Card>
        ) : (
          forum.threads.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              onClick={() => onThreadSelect(thread.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}

