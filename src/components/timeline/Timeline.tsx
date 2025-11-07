import { useEffect, useRef, useMemo } from 'react'
import { ExperienceBubble } from './ExperienceBubble'
import { ResourceGroupPreview } from './ResourceGroupPreview'
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
      const scrollPosition = (currentGrade - 9) * (100 / 4) - 15
      timelineRef.current.scrollLeft = (timelineRef.current.scrollWidth * scrollPosition) / 100
    }
  }, [currentGrade])

  // Filter resources to show upcoming ones
  const upcomingResources = useMemo(() => {
    return resources.filter((res) => {
      if (!res.deadline) return true
      const deadlineDate = new Date(res.deadline)
      return deadlineDate > new Date()
    })
  }, [resources])

  // Group resources by type
  const resourcesByType = useMemo(() => {
    const grouped: Record<string, Resource[]> = {}
    upcomingResources.forEach((res) => {
      if (!grouped[res.type]) {
        grouped[res.type] = []
      }
      grouped[res.type].push(res)
    })
    return grouped
  }, [upcomingResources])

  // Calculate positions for resource groups along timeline
  const getResourceGroupPosition = (index: number): { position: number; side: 'above' | 'below' } => {
    const basePositions = [33, 50, 66, 83]
    const position = basePositions[index % basePositions.length]
    const side = index % 2 === 0 ? 'above' : 'below'
    return { position, side }
  }

  // Position experiences along timeline (past/current)
  const getExperiencePosition = (experience: Experience): number => {
    const gradePositions: Record<number, number> = {
      9: 0,
      10: 33,
      11: 66,
      12: 100,
    }
    return gradePositions[experience.gradeLevel] || 0
  }

  const resourceTypes = Object.keys(resourcesByType)

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Timeline</h2>
        <p className="text-muted-foreground">
          Track your progress from 9th grade through graduation
        </p>
      </div>

      {/* Scrollable Container with proper padding to prevent cutoff */}
      <div className="relative">
        <div
          ref={timelineRef}
          className="overflow-x-auto overflow-y-visible pb-40 pt-40 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="relative min-w-[1600px] h-[500px] px-20">
            {/* Main Timeline Line */}
            <div className="absolute top-1/2 left-20 right-20 h-1 bg-primary transform -translate-y-1/2 z-10" />

            {/* Grade Markers */}
            {grades.map((grade, index) => {
              const isCurrent = grade === currentGrade
              const position = (index / (grades.length - 1)) * 100
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1600) * 100)

              return (
                <div
                  key={grade}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-20"
                  style={{ left: `${leftPosition}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full border-3 ${
                        isCurrent
                          ? 'bg-primary border-primary scale-125 shadow-lg'
                          : 'bg-background border-primary/60'
                      } transition-all`}
                      style={{ borderWidth: '3px' }}
                    />
                    <span
                      className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                        isCurrent ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {grade === 9 && '9th Grade'}
                      {grade === 10 && '10th Grade'}
                      {grade === 11 && '11th Grade'}
                      {grade === 12 && '12th Grade'}
                    </span>
                    {isCurrent && (
                      <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-8 bg-dashed border-dashed border-primary/40" style={{ borderLeftWidth: '1px', borderStyle: 'dashed' }} />
                        <span className="absolute top-8 left-1/2 transform -translate-x-1/2 text-[10px] text-primary font-medium whitespace-nowrap">
                          You are here
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Experiences (Past/Current) - Positioned along timeline */}
            {experiences.map((experience, index) => {
              const position = getExperiencePosition(experience)
              const side = index % 2 === 0 ? 'above' : 'below'
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1600) * 100)

              return (
                <div
                  key={experience.id}
                  className="absolute transform -translate-x-1/2 z-30"
                  style={{
                    left: `${leftPosition}%`,
                    [side === 'above' ? 'bottom' : 'top']: side === 'above' ? 'calc(50% + 60px)' : 'calc(50% + 60px)',
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Connection Line */}
                    <div
                      className={`w-0.5 ${side === 'above' ? 'h-12 mb-2' : 'h-12 mb-2'} bg-primary/30`}
                    />
                    {/* Experience Bubble */}
                    <ExperienceBubble
                      experience={experience}
                      onClick={() => onExperienceClick?.(experience)}
                    />
                  </div>
                </div>
              )
            })}

            {/* Resource Groups - Positioned along timeline */}
            {resourceTypes.map((type, index) => {
              const groupResources = resourcesByType[type]
              const { position, side } = getResourceGroupPosition(index)
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1600) * 100)

              return (
                <ResourceGroupPreview
                  key={type}
                  type={type}
                  resources={groupResources}
                  position={leftPosition}
                  side={side}
                  onResourceClick={onResourceClick}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="text-sm font-semibold mb-2">Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary" />
            <span>Current Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-background border-2 border-primary/60" />
            <span>Other Grades</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-0.5 bg-primary/30" />
            <span>Timeline</span>
          </div>
        </div>
      </div>
    </div>
  )
}
