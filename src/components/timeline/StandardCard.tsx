import { useState } from 'react'
import { ThumbsUp, ThumbsDown, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useVoting } from '@/hooks/useVoting'
import { format } from 'date-fns'
import type { Experience, Resource, CareerSuggestion } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'

interface StandardCardProps {
  type: 'experience' | 'resource' | 'career'
  data: Experience | Resource | CareerSuggestion
  onClick?: () => void
  onResourceClick?: (resource: Resource) => void
  experiences?: Experience[]
}

export function StandardCard({ type, data, onClick, onResourceClick, experiences = [] }: StandardCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { vote, getVote, getVoteCount } = useVoting()

  // Get voting info
  const itemId = data.id
  const itemType = type === 'career' ? 'career' : 'resource'
  const userVote = getVote(itemId, itemType)
  const voteCounts = getVoteCount(itemId, itemType)

  const handleVote = (voteType: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation()
    vote(itemId, itemType, voteType)
  }

  // Standardized card dimensions
  const cardClasses = "w-[320px] h-[400px] flex flex-col border-3 border-primary/30 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/95 hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 shadow-lg"
  const cardStyle = { borderWidth: '3px' }

  // Render based on type
  if (type === 'experience') {
    const experience = data as Experience
    const dateRange = formatDateRange(experience.startDate, experience.endDate)
    
    return (
      <Card className={cardClasses} onClick={onClick} style={cardStyle}>
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{experience.title}</h3>
              <p className="text-xs text-muted-foreground font-medium">{dateRange}</p>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">{experience.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {experience.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {experience.tags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                  +{experience.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t-2 border-border/50">
            <button
              onClick={(e) => handleVote('up', e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                userVote === 'up'
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span className="font-medium">{voteCounts.up}</span>
            </button>
            <button
              onClick={(e) => handleVote('down', e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                userVote === 'down'
                  ? 'bg-destructive/20 text-destructive shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span className="font-medium">{voteCounts.down}</span>
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (type === 'resource') {
    const resource = data as Resource
    const typeConfig: Record<string, { label: string; icon: string }> = {
      scholarship: { label: 'Scholarship', icon: '💰' },
      paid: { label: 'Job & Paid', icon: '💼' },
      'club-fair': { label: 'Club Fair', icon: '🎪' },
      event: { label: 'Event', icon: '📅' },
      afterschool: { label: 'Program', icon: '🎨' },
    }
    const config = typeConfig[resource.type] || { label: resource.type, icon: '📌' }

    return (
      <Card className={cardClasses} onClick={() => onResourceClick?.(resource as Resource)} style={cardStyle}>
        <CardContent className="p-5 h-full flex flex-col">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <Badge variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                {config.label}
              </Badge>
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{resource.title}</h3>
              {resource.deadline && (
                <p className="text-xs text-muted-foreground font-medium">
                  {format(new Date(resource.deadline), 'MMM yyyy')}
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-4 leading-relaxed">{resource.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                  {tag}
                </Badge>
              ))}
              {resource.tags.length > 3 && (
                <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                  +{resource.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t-2 border-border/50">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleVote('up', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                  userVote === 'up'
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span className="font-medium">{voteCounts.up}</span>
              </button>
              <button
                onClick={(e) => handleVote('down', e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                  userVote === 'down'
                    ? 'bg-destructive/20 text-destructive shadow-lg'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
                <span className="font-medium">{voteCounts.down}</span>
              </button>
            </div>
            {resource.link && (
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 text-xs font-semibold"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Career type
  const career = data as CareerSuggestion
  const matchingExperience = experiences.find(exp => 
    exp.tags.some(tag => 
      career.relatedExperienceTags?.some(relatedTag => 
        tag.toLowerCase().includes(relatedTag.toLowerCase()) || 
        relatedTag.toLowerCase().includes(tag.toLowerCase())
      )
    )
  )
  const personalizedMessage = matchingExperience 
    ? `Since you did "${matchingExperience.title}", you might like exploring ${career.title.toLowerCase()}.`
    : null

  const getYouTubeEmbedUrl = (videoIdOrUrl?: string) => {
    if (!videoIdOrUrl) return null
    if (/^[a-zA-Z0-9_-]{11}$/.test(videoIdOrUrl)) {
      return `https://www.youtube.com/embed/${videoIdOrUrl}`
    }
    const match = videoIdOrUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`
    }
    return null
  }

  const youtubeEmbedUrl = getYouTubeEmbedUrl(career.youtubeVideo)

  return (
    <Card className={cardClasses} style={cardStyle}>
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {personalizedMessage && (
            <div className="bg-accent/30 border-2 border-accent/50 rounded-xl p-2">
              <p className="text-xs font-medium text-foreground leading-relaxed">{personalizedMessage}</p>
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2">{career.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{career.description}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {career.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs rounded-full px-2 py-0.5">
                {tag}
              </Badge>
            ))}
            {career.tags.length > 3 && (
              <Badge variant="outline" className="text-xs rounded-full px-2 py-0.5">
                +{career.tags.length - 3}
              </Badge>
            )}
          </div>
          {isExpanded && (
            <div className="space-y-3 pt-2 border-t-2 border-border/50">
              {youtubeEmbedUrl && (
                <div className="rounded-xl overflow-hidden">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={`${career.title} - Day in the Life`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-xl"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center justify-between pt-3 border-t-2 border-border/50">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleVote('up', e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                userVote === 'up'
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              <span className="font-medium">{voteCounts.up}</span>
            </button>
            <button
              onClick={(e) => handleVote('down', e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all hover:scale-105 text-xs ${
                userVote === 'down'
                  ? 'bg-destructive/20 text-destructive shadow-lg'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              <span className="font-medium">{voteCounts.down}</span>
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-primary" />
            ) : (
              <ChevronDown className="h-4 w-4 text-primary" />
            )}
          </button>
        </div>
      </CardContent>
    </Card>
  )
}

