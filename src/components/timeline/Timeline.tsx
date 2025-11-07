import { useEffect, useRef } from 'react'
import { ExperienceCard } from './ExperienceCard'
import { ResourcePreviewCard } from './ResourcePreviewCard'
import type { Experience, Resource } from '@/types'
import { alexProfile } from '@/data/alexProfile'

interface TimelineProps {
  experiences: Experience[]
  resources: Resource[]
  onExperienceClick?: (experience: Experience) => void
  onResourceClick?: (resource: Resource) => void
}

const grades = [9, 10, 11, 12] as const

export function Timeline({ experiences, resources, onExperienceClick, onResourceClick }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)
  const currentGrade = alexProfile.grade

  // Scroll to current position on mount
  useEffect(() => {
    if (timelineRef.current) {
      // Scroll to show current grade (10th grade = index 1, so ~33% of width)
      const scrollPosition = (currentGrade - 9) * (100 / 4) - 10 // Offset to show some context
      timelineRef.current.scrollLeft = (timelineRef.current.scrollWidth * scrollPosition) / 100
    }
  }, [currentGrade])

  // Experiences are already grouped by gradeLevel in the data

  // Filter resources to show upcoming ones (with deadlines in the future)
  const upcomingResources = resources.filter((res) => {
    if (!res.deadline) return true // Show ongoing opportunities
    const deadlineDate = new Date(res.deadline)
    return deadlineDate > new Date()
  })

  // Group resources by approximate grade level (simplified - based on deadline)
  const resourcesByGrade: Record<number, Resource[]> = {}
  upcomingResources.forEach((res) => {
    // For demo, distribute resources across grades 10-12
    // In reality, this would be calculated based on eligibility/grade requirements
    const targetGrade = res.deadline 
      ? (new Date(res.deadline).getFullYear() === 2025 ? 10 : 11)
      : 10
    if (!resourcesByGrade[targetGrade]) resourcesByGrade[targetGrade] = []
    resourcesByGrade[targetGrade].push(res)
  })

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Timeline</h2>
        <p className="text-muted-foreground">
          Track your progress from 9th grade through graduation
        </p>
      </div>

      <div
        ref={timelineRef}
        className="overflow-x-auto pb-8 scroll-smooth"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="relative min-w-[1200px]">
          {/* Grade Markers */}
          <div className="relative h-12 mb-8 border-b-2 border-primary/20">
            {grades.map((grade, index) => {
              const isCurrent = grade === currentGrade
              const position = (index / (grades.length - 1)) * 100
              
              return (
                <div
                  key={grade}
                  className="absolute transform -translate-x-1/2"
                  style={{ left: `${position}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        isCurrent
                          ? 'bg-primary border-primary scale-125'
                          : 'bg-background border-primary/40'
                      }`}
                    />
                    <span
                      className={`mt-2 text-sm font-medium ${
                        isCurrent ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {grade === 9 && '9th Grade'}
                      {grade === 10 && '10th Grade'}
                      {grade === 11 && '11th Grade'}
                      {grade === 12 && '12th Grade'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Timeline Content */}
          <div className="relative">
            {/* Experiences Section (Past/Current) */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                Your Experiences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {experiences.map((experience) => (
                  <div key={experience.id}>
                    <ExperienceCard
                      experience={experience}
                      onClick={() => onExperienceClick?.(experience)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-dashed border-muted my-8" />

            {/* Resources Section (Upcoming) */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
                Upcoming Opportunities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingResources.slice(0, 6).map((resource) => (
                  <div key={resource.id}>
                    <ResourcePreviewCard
                      resource={resource}
                      onClick={() => onResourceClick?.(resource)}
                    />
                  </div>
                ))}
              </div>
              {upcomingResources.length > 6 && (
                <div className="mt-4 text-center text-sm text-muted-foreground">
                  <p>And {upcomingResources.length - 6} more opportunities</p>
                  <p className="text-xs mt-1">View all in the Resources section</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

