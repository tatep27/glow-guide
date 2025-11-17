import { useState, useMemo } from 'react'
import { ChevronDown, ChevronUp, ExternalLink, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { careerSuggestions } from '@/data/careerSuggestions'
import { useExperiences } from '@/hooks/useExperiences'
import type { CareerSuggestion, Experience } from '@/types'

function CareerCard({ career, experiences }: { career: CareerSuggestion; experiences: Experience[] }) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Find matching experience based on tags
  const matchingExperience = useMemo(() => {
    if (!career.relatedExperienceTags || career.relatedExperienceTags.length === 0) {
      return null
    }
    
    return experiences.find(exp => 
      exp.tags.some(tag => 
        career.relatedExperienceTags?.some(relatedTag => 
          tag.toLowerCase().includes(relatedTag.toLowerCase()) || 
          relatedTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }, [career, experiences])

  const personalizedMessage = useMemo(() => {
    if (matchingExperience) {
      return `Since you did "${matchingExperience.title}", you might like exploring ${career.title.toLowerCase()}.`
    }
    return null
  }, [matchingExperience, career])

  // Extract YouTube video ID from URL or use as-is if it's already an ID
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
    <Card className="w-full max-w-2xl hover:shadow-2xl transition-all duration-300 border-3 border-primary/30 rounded-3xl overflow-hidden bg-gradient-to-br from-card to-card/95">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Personalized Message */}
          {personalizedMessage && (
            <div className="bg-accent/30 border-2 border-accent/50 rounded-2xl p-4 mb-4">
              <p className="text-sm font-medium text-foreground leading-relaxed">
                {personalizedMessage}
              </p>
            </div>
          )}

          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">{career.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{career.description}</p>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-4 p-2 rounded-full hover:bg-muted transition-colors hover:scale-110"
              aria-label={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <ChevronUp className="h-5 w-5 text-primary" />
              ) : (
                <ChevronDown className="h-5 w-5 text-primary" />
              )}
            </button>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {career.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs rounded-full px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="pt-4 space-y-6 border-t-2 border-border/50 animate-in slide-in-from-top-2 duration-300">
              {/* YouTube Video */}
              {youtubeEmbedUrl && (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={youtubeEmbedUrl}
                      title={`${career.title} - Day in the Life`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute top-0 left-0 w-full h-full rounded-2xl"
                    />
                  </div>
                </div>
              )}

              {/* Day in the Life */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  A Day in the Life
                </h4>
                <ul className="space-y-2">
                  {career.dayInTheLife.map((activity, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground bg-muted/30 rounded-xl p-3">
                      <span className="text-primary font-bold mt-0.5 bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {index + 1}
                      </span>
                      <span>{activity}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Learning Resources */}
              <div>
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  Learn More
                </h4>
                <div className="space-y-2">
                  {career.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-4 rounded-2xl bg-muted hover:bg-muted/80 transition-all hover:scale-[1.02] group shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {resource.title}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function ExploreCareersPage() {
  const { experiences } = useExperiences()
  
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Explore Possible Futures</h1>
        <p className="text-muted-foreground text-lg">
          Discover career paths that connect to your interests and experiences. Each career includes a day-in-the-life video 
          and resources to help you learn more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {careerSuggestions.map((career) => (
          <CareerCard key={career.id} career={career} experiences={experiences} />
        ))}
      </div>
    </div>
  )
}

