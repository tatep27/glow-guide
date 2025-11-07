import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, Calendar, MapPin, Bookmark, BookmarkCheck } from 'lucide-react'
import type { Resource } from '@/types'
import { formatDate, getDeadlineUrgency } from '@/lib/dateUtils'
import { useLocalStorage } from '@/hooks/useLocalStorage'

interface ResourceDetailProps {
  resource: Resource
  onClose: () => void
}

const typeLabels: Record<string, string> = {
  scholarship: 'Scholarship',
  afterschool: 'Afterschool Program',
  paid: 'Paid Opportunity',
  'club-fair': 'Club Fair',
  event: 'Event',
}

const urgencyColors = {
  urgent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-300 dark:border-red-700',
  soon: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700',
  upcoming: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300 dark:border-green-700',
}

export function ResourceDetail({ resource, onClose }: ResourceDetailProps) {
  const [savedResources, setSavedResources] = useLocalStorage<string[]>('saved-resources', [])
  const isSaved = savedResources.includes(resource.id)
  const urgency = getDeadlineUrgency(resource.deadline)
  const urgencyClass = urgency ? urgencyColors[urgency] : ''

  const handleSaveToggle = () => {
    if (isSaved) {
      setSavedResources(savedResources.filter((id) => id !== resource.id))
    } else {
      setSavedResources([...savedResources, resource.id])
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{typeLabels[resource.type]}</Badge>
                {urgency && (
                  <Badge className={urgencyClass}>
                    {urgency === 'urgent' && 'Urgent'}
                    {urgency === 'soon' && 'Due Soon'}
                    {urgency === 'upcoming' && 'Upcoming'}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
              <CardDescription className="text-base">{resource.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Deadline */}
          {resource.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Deadline:</strong> {formatDate(resource.deadline)}
              </span>
            </div>
          )}

          {/* Location */}
          {resource.location && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <strong>Location:</strong> {resource.location}
              </span>
            </div>
          )}

          {/* Eligibility */}
          {resource.eligibility.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Eligibility Requirements</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {resource.eligibility.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {resource.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSaveToggle} variant={isSaved ? 'default' : 'outline'}>
              {isSaved ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Saved
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            {resource.link && (
              <Button onClick={() => window.open(resource.link!, '_blank')} variant="default">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Website
              </Button>
            )}
            <Button onClick={onClose} variant="outline" className="ml-auto">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

