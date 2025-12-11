import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { alexProfile } from '@/data/alexProfile'
import { ArrowRight, FileText } from 'lucide-react'
import { useExperiences } from '@/hooks/useExperiences'
import { TimelinePreview } from '@/components/timeline/TimelinePreview'

export function DashboardPage() {
  const navigate = useNavigate()
  const { experiences } = useExperiences()

  const handleTimelineClick = () => {
    navigate('/timeline')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back, {alexProfile.name}!</h1>
        <p className="text-muted-foreground">
          {alexProfile.grade === 9 && '9th Grade'}
          {alexProfile.grade === 10 && '10th Grade'}
          {alexProfile.grade === 11 && '11th Grade'}
          {alexProfile.grade === 12 && '12th Grade'} • {alexProfile.school}
        </p>
      </div>

      {/* Timeline Preview Card - Large, Full Width */}
      <Card 
        className="border-3 border-primary/30 rounded-3xl hover:shadow-2xl transition-all cursor-pointer"
        onClick={handleTimelineClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">View Your Timeline</h3>
              <p className="text-muted-foreground">See your journey and explore next steps</p>
            </div>
            <ArrowRight className="h-8 w-8 text-primary" />
          </div>
          
          {/* Timeline Preview */}
          <div 
            className="mt-4"
            onClick={(e) => {
              // Prevent card click when interacting with preview
              e.stopPropagation()
            }}
          >
            <TimelinePreview experiences={experiences} />
          </div>
        </CardContent>
      </Card>

      {/* Other Quick Actions - Resources, Resume, Forums */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-3 border-primary/30 rounded-3xl hover:shadow-2xl transition-all cursor-pointer">
          <Link to="/resources">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Browse Resources</h3>
                  <p className="text-muted-foreground">Find opportunities and scholarships</p>
                </div>
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-3 border-primary/30 rounded-3xl hover:shadow-2xl transition-all cursor-pointer">
          <Link to="/resume">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">View Your Resume</h3>
                  <p className="text-muted-foreground">Review and export your resume</p>
                </div>
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="border-3 border-primary/30 rounded-3xl hover:shadow-2xl transition-all cursor-pointer">
          <Link to="/forums">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2">Forums</h3>
                  <p className="text-muted-foreground">Connect with peers and counselors</p>
                </div>
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>
    </div>
  )
}
