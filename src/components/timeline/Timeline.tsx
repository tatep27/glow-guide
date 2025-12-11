import { useMemo, useRef, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { TimelineCard } from './TimelineCard'
import { SpecialEventMarker } from './SpecialEventMarker'
import { TimelinePathSVG, getTimelinePath } from './TimelinePath'
import type { Experience, Resource } from '@/types'
import { alexProfile } from '@/data/alexProfile'
import { specialEvents } from '@/data/specialEvents'

interface TimelineProps {
  experiences: Experience[]
  resources: Resource[]
  onExperienceClick?: (experience: Experience) => void
  onResourceClick?: (resource: Resource) => void
}

// Calculate position along path (0 to 1) based on grade level
const getGradePosition = (gradeLevel: number): number => {
  return (gradeLevel - 9) / 3 // 9th = 0, 10th = 0.33, 11th = 0.66, 12th = 1.0
}

export function Timeline({ experiences, resources, onExperienceClick, onResourceClick }: TimelineProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 2000, height: 400 })
  const currentGrade = alexProfile.grade

  // Update dimensions on mount and resize - make timeline take full width
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current
        const parentWidth = container.parentElement?.clientWidth || window.innerWidth
        // Calculate width to take full horizontal space with padding for cards
        const calculatedWidth = Math.max(parentWidth - 100, 2000) // Ensure minimum width
        setDimensions({
          width: calculatedWidth,
          height: 500, // Increased from 400 to give more vertical space
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Filter experiences: past (before or at current grade) and suggested (resources)
  const pastExperiences = useMemo(() => {
    return experiences.filter(exp => exp.gradeLevel <= currentGrade)
  }, [experiences, currentGrade])

  const suggestedResources = useMemo(() => {
    // Filter resources that are upcoming (deadline in future or no deadline)
    // For resources without deadlines, assign a default deadline 90 days from now
    return resources
      .map(res => {
        if (!res.deadline) {
          // Assign a default deadline 90 days from now for sorting
          return { ...res, deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
        }
        return res
      })
      .filter(res => {
        const deadlineDate = new Date(res.deadline!)
        return deadlineDate > new Date()
      })
      .slice(0, 6) // Limit to 6 suggested resources
  }, [resources])

  // Get special events for timeline
  const timelineEvents = useMemo(() => {
    return specialEvents.filter(event => event.gradeLevel >= currentGrade || event.gradeLevel === currentGrade)
  }, [currentGrade])

  // Get path helper functions
  const pathHelpers = useMemo(() => {
    return getTimelinePath({ 
      width: dimensions.width, 
      height: dimensions.height
    })
  }, [dimensions.width, dimensions.height])

  // Calculate card positions with collision detection to prevent overlap
  const getCardPosition = (index: number, total: number, isPast: boolean, existingPositions: Array<{ x: number; y: number }> = []) => {
    const baseT = isPast 
      ? (index / Math.max(total, 1)) * getGradePosition(currentGrade)
      : getGradePosition(currentGrade) + ((index + 1) / (suggestedResources.length + 1)) * (1 - getGradePosition(currentGrade))
    
    const point = pathHelpers.getPointOnPath(baseT)
    
    // Try different vertical offsets to avoid overlap
    let verticalOffset = (index % 2 === 0 ? -1 : 1) * (120 + (index % 3) * 40)
    let attempts = 0
    const minDistance = 280 // Minimum distance between cards (increased for better spacing)
    
    // Check for collisions and adjust position
    while (attempts < 10) {
      const testX = point.x
      const testY = point.y + verticalOffset
      
      const hasCollision = existingPositions.some(pos => {
        const distance = Math.sqrt(Math.pow(pos.x - testX, 2) + Math.pow(pos.y - testY, 2))
        return distance < minDistance
      })
      
      if (!hasCollision) {
        break
      }
      
      // Try different offset
      verticalOffset = (index % 2 === 0 ? -1 : 1) * (120 + (index % 3) * 40 + attempts * 50)
      attempts++
    }
    
    return {
      x: point.x,
      y: point.y + verticalOffset,
      pathT: baseT,
    }
  }

  // Scroll to current position on mount
  useEffect(() => {
    if (containerRef.current) {
      const currentPosition = getGradePosition(currentGrade)
      const scrollPosition = (containerRef.current.scrollWidth * currentPosition) / 100
      containerRef.current.scrollLeft = scrollPosition - 200 // Offset to center view
    }
  }, [currentGrade, dimensions.width])

  const handleKeepGoing = () => {
    navigate('/explore-careers')
  }

  return (
    <div className="w-full">
      {/* Student-facing description */}
      <div className="mb-8 p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl border-2 border-primary/20">
        <h2 className="text-2xl font-bold mb-3 text-foreground">Timeline View</h2>
        <p className="text-muted-foreground leading-relaxed">
          In the timeline view, see upcoming opportunities and important dates. Click on any card to learn more. Visit the career exploration at the end of the timeline to see where your journey could lead!
        </p>
      </div>

      {/* Scrollable Timeline Container with border and padding */}
      <div className="border-3 border-primary/30 rounded-3xl p-8 bg-card/50">
        <div
          ref={containerRef}
          className="relative overflow-x-auto overflow-y-visible pb-40 pt-32 scroll-smooth w-full"
          style={{ scrollbarWidth: 'thin' }}
        >
        <div 
          className="relative"
          style={{ 
            width: `${dimensions.width + 300}px`, // Add padding to total width
            height: `${dimensions.height + 200}px`, // Increased height to accommodate cards
            minHeight: '800px', // Increased from 600px to prevent card cutoff
            paddingLeft: '150px', // Add left padding so cards aren't cut off
            paddingRight: '150px', // Add right padding
            paddingTop: '100px', // Add top padding for cards above timeline
            paddingBottom: '100px', // Add bottom padding for cards below timeline
          }}
        >
          {/* SVG Path - offset by padding */}
          <div style={{ position: 'absolute', left: '150px', top: '100px' }}>
            <TimelinePathSVG 
              width={dimensions.width} 
              height={dimensions.height} 
              currentGrade={currentGrade}
            />
          </div>

          {/* Past Experience Cards */}
          {(() => {
            // Calculate all experience positions first to avoid recursive calls
            const experiencePositions: Array<{ x: number; y: number; pathT: number }> = []
            pastExperiences.forEach((_, index) => {
              const previousPositions = experiencePositions.map(p => ({ x: p.x, y: p.y }))
              const pos = getCardPosition(index, pastExperiences.length, true, previousPositions)
              experiencePositions.push(pos)
            })
            
            return pastExperiences.map((experience, index) => {
              const position = experiencePositions[index]
            // Adjust for padding offset (horizontal and vertical)
            const adjustedPosition = { x: position.x + 150, y: position.y + 100 }

              return (
                <div
                  key={experience.id}
                className="absolute z-10"
                style={{
                  left: `${adjustedPosition.x}px`,
                  top: `${adjustedPosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <TimelineCard
                  type="experience"
                  data={experience}
                      onClick={() => onExperienceClick?.(experience)}
                    />
                </div>
              )
            })
          })()}

          {/* Suggested Resource Cards */}
          {(() => {
            // Calculate all experience positions first
            const experiencePositions: Array<{ x: number; y: number }> = []
            pastExperiences.forEach((_, index) => {
              const previousPositions = experiencePositions.map(p => ({ x: p.x, y: p.y }))
              const pos = getCardPosition(index, pastExperiences.length, true, previousPositions)
              experiencePositions.push({ x: pos.x, y: pos.y })
            })
            
            // Calculate all resource positions
            const resourcePositions: Array<{ x: number; y: number; pathT: number }> = []
            suggestedResources.forEach((_, index) => {
              const previousPositions = [...experiencePositions, ...resourcePositions.map(p => ({ x: p.x, y: p.y }))]
              const pos = getCardPosition(index, suggestedResources.length, false, previousPositions)
              resourcePositions.push(pos)
            })
            
            return suggestedResources.map((resource, index) => {
              const position = resourcePositions[index]
            // Adjust for padding offset (horizontal and vertical)
            const adjustedPosition = { x: position.x + 150, y: position.y + 100 }
            
            return (
              <div
                key={resource.id}
                className="absolute z-10"
                style={{
                  left: `${adjustedPosition.x}px`,
                  top: `${adjustedPosition.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <TimelineCard
                  type="resource"
                  data={resource}
                  onResourceClick={onResourceClick}
                />
              </div>
            )
            })
          })()}

          {/* Special Event Markers */}
          {(() => {
            // Group events by grade level and position them to avoid overlap
            const eventsByGrade = timelineEvents.reduce((acc, event) => {
              const grade = event.gradeLevel
              if (!acc[grade]) acc[grade] = []
              acc[grade].push(event)
              return acc
            }, {} as Record<number, typeof timelineEvents>)
            
            // Timeline center Y is always at dimensions.height / 2, adjusted for padding
            const timelineCenterY = dimensions.height / 2 + 100
            
            return timelineEvents.map((event) => {
              // For graduation events at 12th grade, position to the left of the grade marker
              let t = getGradePosition(event.gradeLevel)
              if (event.title === 'Graduation' && event.gradeLevel === 12) {
                // Position graduation slightly to the left of the 12th grade marker (t = 1.0)
                t = 0.92 // Position at 92% of the way, leaving space before the 12th grade marker
              }
              const point = pathHelpers.getPointOnPath(t)
              
              // Get all events at the same grade level
              const sameGradeEvents = eventsByGrade[event.gradeLevel] || []
              const eventIndex = sameGradeEvents.findIndex(e => e.id === event.id)
              
              // Space events horizontally to avoid overlap - increased spacing significantly
              // Each event gets a position offset based on its index
              const spacing = 250 // Much larger space between events
              let offsetX = eventIndex * spacing - (sameGradeEvents.length - 1) * spacing / 2
              
              // For graduation, ensure it's positioned to the left (negative offset)
              if (event.title === 'Graduation' && event.gradeLevel === 12) {
                offsetX = -150 // Position to the left of the grade marker
              }
              
              // Force stars to be EXACTLY on the timeline line (center Y)
              // Use the exact center Y from dimensions, not from path point
              const starY = timelineCenterY
              
              // Labels will be positioned above or below based on index to avoid grade labels
              const isAbove = eventIndex % 2 === 0
              
              // Offset SAT events more to avoid grade dots
              const satOffset = event.type === 'sat' ? 80 : 0
              
              return (
                <SpecialEventMarker
                  key={event.id}
                  event={event}
                  position={{ x: point.x + offsetX + satOffset + 150, y: starY }}
                  isAboveTimeline={isAbove}
                />
              )
            })
          })()}

          {/* "Explore what could be next!" Button at end of 12th grade */}
          <div
            className="absolute z-20"
            style={{
              left: `${dimensions.width - 100 + 150}px`, // Adjust for padding
              top: `${dimensions.height / 2 - 200 + 100}px`, // Adjust for vertical padding
              transform: 'translateY(-50%)',
            }}
          >
            <button
              onClick={handleKeepGoing}
              className="flex flex-col items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2.5 rounded-2xl shadow-2xl hover:scale-110 transition-all duration-300 border-3 border-primary-foreground/20"
              style={{ borderWidth: '3px' }}
            >
              <span className="font-bold text-sm">Explore what could be next!</span>
              <ArrowRight className="h-4 w-4 animate-pulse" />
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
