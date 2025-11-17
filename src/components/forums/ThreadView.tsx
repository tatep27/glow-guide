import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, MessageSquare, ArrowLeft } from 'lucide-react'
import { formatDistanceToNow, parseISO } from 'date-fns'
import { useViewMode } from '@/hooks/useViewMode'
import { getAuthorDisplayName } from '@/lib/forumUtils'
import type { ForumThread, ForumPost } from '@/types'

interface ThreadViewProps {
  thread: ForumThread
  forumTitle: string
  onBack: () => void
  onPostReply: (content: string, parentId?: string) => void
  onLikePost: (postId: string) => void
  likedPosts: Set<string>
}

export function ThreadView({ thread, forumTitle, onBack, onPostReply, onLikePost, likedPosts }: ThreadViewProps) {
  const { isAdminView } = useViewMode()
  const [replyContent, setReplyContent] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const handleLike = (postId: string) => {
    onLikePost(postId)
  }

  const handleSubmitReply = () => {
    if (replyContent.trim()) {
      onPostReply(replyContent.trim(), replyingTo || undefined)
      setReplyContent('')
      setReplyingTo(null)
    }
  }

  // Organize posts into tree structure
  const rootPosts = thread.posts.filter((p) => !p.parentId)
  const repliesByParent = thread.posts.reduce((acc, post) => {
    if (post.parentId) {
      if (!acc[post.parentId]) acc[post.parentId] = []
      acc[post.parentId].push(post)
    }
    return acc
  }, {} as Record<string, ForumPost[]>)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Forums
        </Button>
        <Badge variant="outline">{forumTitle}</Badge>
      </div>

      <Card className="border-2">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-4">{thread.title}</h1>
          <div className="space-y-6">
            {rootPosts.map((post) => (
              <PostTree
                key={post.id}
                post={post}
                replies={repliesByParent[post.id] || []}
                repliesByParent={repliesByParent}
                likedPosts={likedPosts}
                onLike={handleLike}
                onReply={(parentId) => setReplyingTo(parentId)}
                replyingTo={replyingTo}
                replyContent={replyContent}
                onReplyContentChange={setReplyContent}
                onSubmitReply={handleSubmitReply}
                isAdminView={isAdminView}
              />
            ))}
          </div>

          {/* New Reply Form */}
          {!replyingTo && (
            <div className="mt-8 pt-6 border-t space-y-4">
              <h3 className="font-semibold">Post a Reply</h3>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                className="w-full min-h-[100px] p-4 border rounded-lg resize-y bg-background"
              />
              <Button onClick={handleSubmitReply} disabled={!replyContent.trim()}>
                Post Reply
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface PostTreeProps {
  post: ForumPost
  replies: ForumPost[]
  repliesByParent: Record<string, ForumPost[]>
  likedPosts: Set<string>
  onLike: (postId: string) => void
  onReply: (parentId: string) => void
  replyingTo: string | null
  replyContent: string
  onReplyContentChange: (content: string) => void
  onSubmitReply: () => void
  isAdminView: boolean
}

function PostTree({
  post,
  replies,
  repliesByParent,
  likedPosts,
  onLike,
  onReply,
  replyingTo,
  replyContent,
  onReplyContentChange,
  onSubmitReply,
  isAdminView,
}: PostTreeProps) {
  const isLiked = likedPosts.has(post.id)
  const postDate = parseISO(post.timestamp)
  const displayName = getAuthorDisplayName(post.authorId, post.authorName, isAdminView)

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg border-2 ${post.isCounselor ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-300 dark:border-blue-700' : 'bg-muted'}`}>
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <span className={`font-semibold ${post.isCounselor ? 'text-blue-700 dark:text-blue-300' : ''}`}>
                {displayName}
              </span>
              {post.isCounselor && (
                <Badge variant="default" className="text-xs">Counselor</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(postDate, { addSuffix: true })}
            </span>
          </div>
        </div>
        <p className="mt-3 mb-4 whitespace-pre-wrap">{post.content}</p>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(post.id)}
            className={isLiked ? 'text-primary' : ''}
          >
            <ThumbsUp className={`h-4 w-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            {post.likes + (isLiked ? 1 : 0)}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onReply(post.id)}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Reply
          </Button>
        </div>

        {/* Reply Form */}
        {replyingTo === post.id && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <textarea
              value={replyContent}
              onChange={(e) => onReplyContentChange(e.target.value)}
              placeholder="Write your reply..."
              className="w-full min-h-[80px] p-3 border rounded-lg resize-y bg-background text-sm"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSubmitReply} disabled={!replyContent.trim()}>
                Post Reply
              </Button>
              <Button size="sm" variant="outline" onClick={() => onReplyContentChange('')}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {replies.length > 0 && (
        <div className="ml-8 space-y-4 border-l-2 border-muted pl-4">
          {replies.map((reply) => (
            <PostTree
              key={reply.id}
              post={reply}
              replies={repliesByParent[reply.id] || []}
              repliesByParent={repliesByParent}
              likedPosts={likedPosts}
              onLike={onLike}
              onReply={onReply}
              replyingTo={replyingTo}
              replyContent={replyContent}
              onReplyContentChange={onReplyContentChange}
              onSubmitReply={onSubmitReply}
              isAdminView={isAdminView}
            />
          ))}
        </div>
      )}
    </div>
  )
}

