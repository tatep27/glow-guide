import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Experience } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'
import { X } from 'lucide-react'

interface ExperienceDetailModalProps {
  experience: Experience
  onClose: () => void
}

export function ExperienceDetailModal({ experience, onClose }: ExperienceDetailModalProps) {
  const dateRange = formatDateRange(experience.startDate, experience.endDate)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{experience.title}</CardTitle>
              <CardDescription className="text-base">{dateRange}</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{experience.description}</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Type</h3>
            <Badge variant="outline" className="capitalize">
              {experience.type}
            </Badge>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {experience.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="pt-4 border-t">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

