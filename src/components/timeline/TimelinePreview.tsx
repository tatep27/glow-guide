import { useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { TimelineCard } from './TimelineCard'
import { TimelinePathSVG, getTimelinePath } from './TimelinePath'
import { SpecialEventMarker } from './SpecialEventMarker'
import type { Experience, Resource } from '@/types'
import { alexProfile } from '@/data/alexProfile'
import { resources } from '@/data/resources'
import { specialEvents } from '@/data/specialEvents'

// Calculate position along path (0 to 1) based on grade level
const getGradePosition = (gradeLevel: number): number => {
  return (gradeLevel - 9) / 3 // 9th = 0, 10th = 0.33, 11th = 0.66, 12th = 1.0
}

export function TimelinePreview({ experiences }: TimelinePreviewProps) {
  const navigate = useNavigate()
  const containerRef = useRef<HTMLDivElement>(null)
  const currentGrade = alexProfile.grade
  const previewWidth = 1200 // Increased width to enable scrolling
  const previewHeight = 400 // Increased vertical space to prevent card cutoff

  // Get past experiences (1-2 most recent)
  const pastExperiences = useMemo(() => {
    return experiences
      .filter(exp => exp.gradeLevel <= currentGrade)
      .sort((a, b) => {
        const dateA = new Date(a.startDate).getTime()
        const dateB = new Date(b.startDate).getTime()
        return dateB - dateA // Most recent first
      })
      .slice(0, 1) // Show 1 past experience
  }, [experiences, currentGrade])

  // Get upcoming resources (future opportunities)
  const upcomingResources = useMemo(() => {
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
      .sort((a, b) => {
        const dateA = new Date(a.deadline!).getTime()
        const dateB = new Date(b.deadline!).getTime()
        return dateA - dateB // Earliest deadline first
      })
      .slice(0, 2) // Show 2 upcoming resources
  }, [])

  // Get upcoming special events
  const upcomingEvents = useMemo(() => {
    return specialEvents
      .filter(event => event.gradeLevel >= currentGrade)
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateA - dateB // Earliest first
      })
      .slice(0, 2) // Show 2 upcoming events
  }, [currentGrade])

  // Get path helper functions
  const pathHelpers = useMemo(() => {
    return getTimelinePath({ 
      width: previewWidth, 
      height: previewHeight
    })
  }, [])

  return (
    <div 
      ref={containerRef}
      className="relative overflow-x-auto overflow-y-visible"
      style={{ 
        width: '100%',
        height: `${previewHeight + 250}px`, // Increased to accommodate cards and prevent cutoff
        minHeight: `${previewHeight + 250}px`,
        scrollbarWidth: 'thin',
        WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
        overflowY: 'visible', // Allow cards to extend beyond container
        paddingTop: '50px', // Extra padding at top
        paddingBottom: '50px', // Extra padding at bottom
      }}
      onClick={(e) => {
        // Allow scrolling - don't navigate on scroll
        e.stopPropagation()
      }}
    >
      <div 
        className="relative"
        style={{ 
          width: `${previewWidth}px`,
          height: `${previewHeight + 300}px`, // Extra height to prevent card cutoff
          margin: '0 auto',
          minWidth: `${previewWidth}px`, // Ensure minimum width for scrolling
          overflow: 'visible', // Allow cards to extend beyond
          paddingTop: '100px', // Extra padding at top for cards above timeline
          paddingBottom: '100px', // Extra padding at bottom for cards below timeline
        }}
      >
        {/* SVG Path - offset by padding */}
        <div style={{ position: 'absolute', left: 0, top: '100px' }}>
          <TimelinePathSVG 
            width={previewWidth} 
            height={previewHeight} 
            currentGrade={currentGrade}
          />
        </div>

        {/* Past Experience Cards - positioned before "You are here" */}
        {pastExperiences.map((experience, index) => {
          const t = getGradePosition(experience.gradeLevel)
          const point = pathHelpers.getPointOnPath(t)
          
          // Position below timeline (past experiences) - account for padding
          const verticalOffset = 100 + 100 // Add padding offset
          
          return (
            <div
              key={experience.id}
              className="absolute z-10 pointer-events-none"
              style={{
                left: `${point.x}px`,
                top: `${point.y + verticalOffset}px`,
                transform: 'translate(-50%, -50%) scale(0.7)', // Scale down cards to 70%
              }}
            >
              <TimelineCard
                type="experience"
                data={experience}
                onClick={() => navigate('/timeline')}
              />
            </div>
          )
        })}

        {/* Special Events - positioned on timeline */}
        {upcomingEvents.map((event, index) => {
          const t = getGradePosition(event.gradeLevel)
          const point = pathHelpers.getPointOnPath(t)
          
          // Position events on the timeline (center Y) - account for padding
          const timelineCenterY = previewHeight / 2 + 100 // Add padding offset
          const isAbove = index % 2 === 0
          
          return (
            <SpecialEventMarker
              key={event.id}
              event={event}
              position={{ x: point.x, y: timelineCenterY }}
              isAboveTimeline={isAbove}
            />
          )
        })}

        {/* Upcoming Resource Cards - positioned after "You are here" */}
        {upcomingResources.map((resource, index) => {
          // Position resources after current grade (upcoming)
          // Distribute them between current grade and 12th grade
          const futureT = getGradePosition(currentGrade) + ((index + 1) / (upcomingResources.length + 1)) * (1 - getGradePosition(currentGrade))
          const point = pathHelpers.getPointOnPath(futureT)
          
          // Alternate above/below timeline - account for padding
          const verticalOffset = index % 2 === 0 ? -120 + 100 : 120 + 100 // Add padding offset
          
          return (
            <div
              key={resource.id}
              className="absolute z-10 pointer-events-none"
              style={{
                left: `${point.x}px`,
                top: `${point.y + verticalOffset}px`,
                transform: 'translate(-50%, -50%) scale(0.7)', // Scale down cards to 70%
              }}
            >
              <TimelineCard
                type="resource"
                data={resource}
                onResourceClick={() => navigate('/timeline')}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

