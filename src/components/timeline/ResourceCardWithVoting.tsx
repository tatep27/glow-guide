import { ThumbsUp, ThumbsDown, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Resource } from '@/types'
import { useVoting } from '@/hooks/useVoting'
import { format } from 'date-fns'

interface ResourceCardWithVotingProps {
  resource: Resource
  onResourceClick?: (resource: Resource) => void
}

const typeConfig: Record<string, { label: string; color: string; bgColor: string; icon: string }> = {
  scholarship: {
    label: 'Scholarship',
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    icon: '💰',
  },
  paid: {
    label: 'Job & Paid',
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100 dark:bg-green-900',
    icon: '💼',
  },
  'club-fair': {
    label: 'Club Fair',
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    icon: '🎪',
  },
  event: {
    label: 'Event',
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-100 dark:bg-orange-900',
    icon: '📅',
  },
  afterschool: {
    label: 'Program',
    color: 'text-pink-700 dark:text-pink-300',
    bgColor: 'bg-pink-100 dark:bg-pink-900',
    icon: '🎨',
  },
}

export function ResourceCardWithVoting({ resource, onResourceClick }: ResourceCardWithVotingProps) {
  const { vote, getVote, getVoteCount } = useVoting()
  const userVote = getVote(resource.id, 'resource')
  const voteCounts = getVoteCount(resource.id, 'resource')
  const config = typeConfig[resource.type] || {
    label: resource.type,
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100 dark:bg-gray-900',
    icon: '📌',
  }

  const handleVote = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation()
    vote(resource.id, 'resource', voteType)
  }

  return (
    <Card 
      className="w-full max-w-2xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-3 border-primary/30 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/95 hover:scale-[1.02]"
      onClick={() => onResourceClick?.(resource)}
      style={{ borderWidth: '3px' }}
    >
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">{config.icon}</span>
                <Badge className={`${config.bgColor} ${config.color} border-0 rounded-full px-4 py-1 text-sm font-semibold`}>
                  {config.label}
                </Badge>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{resource.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{resource.description}</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2">
            {resource.deadline && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Deadline: </span>
                {format(new Date(resource.deadline), 'MMMM d, yyyy')}
              </div>
            )}
            {resource.location && (
              <div className="text-sm text-muted-foreground">
                <span className="font-medium">Location: </span>
                {resource.location}
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 5).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full px-3 py-1">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 5 && (
                <Badge variant="outline" className="text-xs rounded-full px-3 py-1">
                  +{resource.tags.length - 5}
                </Badge>
              )}
            </div>
          )}

          {/* Voting and Link */}
          <div className="flex items-center justify-between pt-4 border-t-2 border-border/50">
            <div className="flex items-center gap-4">
              <button
                onClick={(e) => handleVote('up', e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all hover:scale-105 ${
                  userVote === 'up'
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm font-medium">{voteCounts.up}</span>
              </button>
              <button
                onClick={(e) => handleVote('down', e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition-all hover:scale-105 ${
                  userVote === 'down'
                    ? 'bg-destructive/20 text-destructive shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span className="text-sm font-medium">{voteCounts.down}</span>
              </button>
            </div>
            
            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 shadow-lg font-semibold"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="text-sm font-medium">Learn More</span>
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

