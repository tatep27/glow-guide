import { useState, useMemo } from 'react'
import { ForumListView } from '@/components/forums/ForumListView'
import { ThreadListView } from '@/components/forums/ThreadListView'
import { ThreadView } from '@/components/forums/ThreadView'
import { forums } from '@/data/forumData'
import type { Forum, ForumThread, ForumPost } from '@/types'
import { useLocalStorage } from '@/hooks/useLocalStorage'

// Generate anonymous student ID for demo
function generateAnonymousId(): string {
  const existingIds = JSON.parse(localStorage.getItem('anonymous-student-ids') || '[]')
  const newId = `Student_${Math.floor(Math.random() * 1000)}`
  if (!existingIds.includes(newId)) {
    existingIds.push(newId)
    localStorage.setItem('anonymous-student-ids', JSON.stringify(existingIds))
  }
  return newId
}

export function ForumsPage() {
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [anonymousId] = useLocalStorage<string>('anonymous-student-id', generateAnonymousId())
  const [forumData, setForumData] = useLocalStorage<Forum[]>('forum-data', forums)
  const [likedPosts, setLikedPosts] = useLocalStorage<Set<string>>('liked-posts', new Set<string>())

  const selectedThread = useMemo(() => {
    if (!selectedForum || !selectedThreadId) return null
    return selectedForum.threads.find((t) => t.id === selectedThreadId) || null
  }, [selectedForum, selectedThreadId])

  const handleForumSelect = (forum: Forum) => {
    setSelectedForum(forum)
    setSelectedThreadId(null)
  }

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId)
  }

  const handleBackToForums = () => {
    setSelectedForum(null)
    setSelectedThreadId(null)
  }

  const handleBackToThreads = () => {
    setSelectedThreadId(null)
  }

  const handleCreateThread = (title: string, content: string) => {
    if (!selectedForum) return

    const newThread: ForumThread = {
      id: `thread-${Date.now()}`,
      forumId: selectedForum.id,
      title,
      authorId: anonymousId,
      authorName: anonymousId,
      isCounselor: false,
      createdAt: new Date().toISOString().split('T')[0],
      lastActivity: new Date().toISOString(),
      posts: [
        {
          id: `post-${Date.now()}`,
          authorId: anonymousId,
          authorName: anonymousId,
          content,
          timestamp: new Date().toISOString(),
          likes: 0,
          isCounselor: false,
        },
      ],
    }

    setForumData((prev) =>
      prev.map((forum) =>
        forum.id === selectedForum.id
          ? { ...forum, threads: [...forum.threads, newThread] }
          : forum
      )
    )

    // Update selected forum
    setSelectedForum({
      ...selectedForum,
      threads: [...selectedForum.threads, newThread],
    })
  }

  const handleLikePost = (postId: string) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const handlePostReply = (content: string, parentId?: string) => {
    if (!selectedForum || !selectedThread) return

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorId: anonymousId,
      authorName: anonymousId,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      isCounselor: false,
      parentId,
    }

    const updatedThread: ForumThread = {
      ...selectedThread,
      posts: [...selectedThread.posts, newPost],
      lastActivity: new Date().toISOString(),
    }

    setForumData((prev) =>
      prev.map((forum) =>
        forum.id === selectedForum.id
          ? {
              ...forum,
              threads: forum.threads.map((t) =>
                t.id === selectedThread.id ? updatedThread : t
              ),
            }
          : forum
      )
    )

    // Update selected forum and thread
    const updatedForum = {
      ...selectedForum,
      threads: selectedForum.threads.map((t) =>
        t.id === selectedThread.id ? updatedThread : t
      ),
    }
    setSelectedForum(updatedForum)
    setSelectedThreadId(selectedThread.id)
  }

  // Show thread view
  if (selectedThread) {
    return (
      <ThreadView
        thread={selectedThread}
        forumTitle={selectedForum?.title || ''}
        onBack={handleBackToThreads}
        onPostReply={handlePostReply}
        onLikePost={handleLikePost}
        likedPosts={likedPosts}
      />
    )
  }

  // Show thread list for selected forum
  if (selectedForum) {
    return (
      <ThreadListView
        forum={selectedForum}
        onBack={handleBackToForums}
        onThreadSelect={handleThreadSelect}
        onCreateThread={handleCreateThread}
      />
    )
  }

  // Show forum list
  return <ForumListView forums={forumData} onForumSelect={handleForumSelect} />
}
