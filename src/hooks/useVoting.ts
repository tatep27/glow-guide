import { useState, useEffect, useCallback } from 'react'
import type { Vote } from '@/types'

const STORAGE_KEY = 'marei-votes'

interface VoteCounts {
  up: number
  down: number
}

export function useVoting() {
  const [votes, setVotes] = useState<Record<string, Vote>>({})

  // Load votes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setVotes(parsed)
      }
    } catch (error) {
      console.error('Failed to load votes from localStorage:', error)
    }
  }, [])

  // Save votes to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(votes))
    } catch (error) {
      console.error('Failed to save votes to localStorage:', error)
    }
  }, [votes])

  const vote = useCallback((itemId: string, itemType: 'resource' | 'career', voteType: 'up' | 'down') => {
    setVotes((prev) => {
      const key = `${itemType}-${itemId}`
      const existing = prev[key]
      
      // If clicking the same vote, remove it (toggle off)
      if (existing && existing.vote === voteType) {
        const updated = { ...prev }
        delete updated[key]
        return updated
      }
      
      // Otherwise, set the new vote
      return {
        ...prev,
        [key]: {
          itemId,
          itemType,
          vote: voteType,
        },
      }
    })
  }, [])

  const getVote = useCallback((itemId: string, itemType: 'resource' | 'career'): 'up' | 'down' | null => {
    const key = `${itemType}-${itemId}`
    const vote = votes[key]
    return vote ? vote.vote : null
  }, [votes])

  const getVoteCount = useCallback((itemId: string, itemType: 'resource' | 'career'): VoteCounts => {
    const key = `${itemType}-${itemId}`
    const vote = votes[key]
    
    // For now, we only track individual votes, not aggregate counts
    // In a real app, you'd want to track all votes from all users
    // For this implementation, we'll return 1 if the user has voted, 0 otherwise
    if (!vote) {
      return { up: 0, down: 0 }
    }
    
    return vote.vote === 'up' ? { up: 1, down: 0 } : { up: 0, down: 1 }
  }, [votes])

  return {
    vote,
    getVote,
    getVoteCount,
  }
}

