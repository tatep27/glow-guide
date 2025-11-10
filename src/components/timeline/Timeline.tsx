import { useEffect, useRef, useMemo } from 'react'
import { ExperienceBubble } from './ExperienceBubble'
import { ResourceGroupPreview } from './ResourceGroupPreview'
import { GoalsSection } from './GoalsSection'
import type { Experience, Resource, Goal } from '@/types'
import { alexProfile } from '@/data/alexProfile'
import { alexGoals } from '@/data/goals'

interface TimelineProps {
  experiences: Experience[]
  resources: Resource[]
  goals?: Goal[]
  onExperienceClick?: (experience: Experience) => void
  onResourceClick?: (resource: Resource) => void
}

const grades = [9, 10, 11, 12] as const

export function Timeline({ experiences, resources, goals = alexGoals, onExperienceClick, onResourceClick }: TimelineProps) {
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
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Your Journey
        </h2>
        <p className="text-muted-foreground text-lg">
          Track your progress from 9th grade through graduation and beyond
        </p>
      </div>

      {/* Scrollable Container with proper padding to prevent cutoff */}
      <div className="relative">
        <div
          ref={timelineRef}
          className="overflow-x-auto overflow-y-visible pb-40 pt-40 scroll-smooth"
          style={{ scrollbarWidth: 'thin' }}
        >
          <div className="relative min-w-[1800px] h-[500px] px-20">
            {/* Main Timeline Line with gradient */}
            <div className="absolute top-1/2 left-20 right-20 h-2 bg-gradient-to-r from-purple-400 via-primary to-emerald-400 transform -translate-y-1/2 z-10 rounded-full shadow-lg" />
            {/* Animated progress indicator */}
            <div 
              className="absolute top-1/2 left-20 h-2 bg-gradient-to-r from-primary via-primary/80 to-emerald-400 transform -translate-y-1/2 z-11 rounded-full transition-all duration-1000"
              style={{ width: `${((currentGrade - 9) / 3) * 100}%` }}
            />

            {/* Grade Markers */}
            {grades.map((grade, index) => {
              const isCurrent = grade === currentGrade
              const isPast = grade < currentGrade
              const position = (index / (grades.length - 1)) * 100
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1800) * 100)

              return (
                <div
                  key={grade}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 z-20"
                  style={{ left: `${leftPosition}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full border-3 transition-all duration-300 ${
                        isCurrent
                          ? 'w-8 h-8 bg-gradient-to-br from-primary to-primary/80 border-primary scale-125 shadow-xl shadow-primary/50 animate-pulse'
                          : isPast
                          ? 'w-6 h-6 bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-500 shadow-lg'
                          : 'w-5 h-5 bg-background border-primary/40'
                      }`}
                      style={{ borderWidth: '3px' }}
                    />
                    <span
                      className={`mt-3 text-sm font-bold whitespace-nowrap ${
                        isCurrent 
                          ? 'text-primary scale-110' 
                          : isPast 
                          ? 'text-emerald-600 dark:text-emerald-400' 
                          : 'text-muted-foreground'
                      } transition-all`}
                    >
                      {grade === 9 && '9th Grade'}
                      {grade === 10 && '10th Grade'}
                      {grade === 11 && '11th Grade'}
                      {grade === 12 && '12th Grade'}
                    </span>
                    {isCurrent && (
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2">
                        <div className="w-0.5 h-10 bg-gradient-to-b from-primary/60 to-transparent" />
                        <span className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs text-primary font-bold whitespace-nowrap bg-background px-2 py-1 rounded-full border border-primary/30 shadow-md">
                          ✨ You are here
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
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1800) * 100)

              return (
                <div
                  key={experience.id}
                  className="absolute transform -translate-x-1/2 z-30"
                  style={{
                    left: `${leftPosition}%`,
                    [side === 'above' ? 'bottom' : 'top']: side === 'above' ? 'calc(50% + 60px)' : 'calc(50% + 60px)',
                    animation: `fadeIn 0.5s ease-out ${index * 100}ms forwards`,
                    opacity: 0,
                  }}
                >
                  <div className="relative flex flex-col items-center">
                    {/* Connection Line with gradient */}
                    <div
                      className={`w-1 ${side === 'above' ? 'h-14 mb-2' : 'h-14 mb-2'} bg-gradient-to-b from-primary/50 to-primary/20 rounded-full`}
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
              const leftPosition = 20 + (position / 100) * (100 - (40 / 1800) * 100)

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

      {/* Goals Section */}
      <GoalsSection goals={goals} />

      {/* Enhanced Legend */}
      <div className="mt-8 p-6 bg-gradient-to-r from-muted via-muted/50 to-muted rounded-xl border-2 border-primary/20">
        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Timeline Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 border-2 border-primary shadow-md" />
            <span className="font-medium">Current Grade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border-2 border-emerald-500" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-background border-2 border-primary/40" />
            <span className="font-medium">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 via-primary to-emerald-400 rounded-full" />
            <span className="font-medium">Your Journey</span>
          </div>
        </div>
      </div>
    </div>
  )
}
