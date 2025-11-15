// Generate a winding path using SVG path commands
export function getTimelinePath({ width, height }: { width: number; height: number }) {
  // Calculate grade positions (0 to 1)
  const grades = [9, 10, 11, 12]
  const gradePositions = grades.map((grade, index) => ({
    grade,
    position: index / (grades.length - 1), // 0, 0.33, 0.66, 1.0
  }))

  // Create a straight horizontal path
  const centerY = height / 2
  const pathD = `M 0 ${centerY} L ${width} ${centerY}`

  // Get point on path at a given t value (0 to 1)
  const getPointOnPath = (t: number): { x: number; y: number } => {
    const centerY = height / 2
    const x = width * t
    const y = centerY // Straight horizontal line
    return { x, y }
  }

  return {
    pathD,
    gradePositions,
    getPointOnPath,
  }
}

// Helper component to render the SVG path
export function TimelinePathSVG({ 
  width, 
  height, 
  currentGrade 
}: { 
  width: number
  height: number
  currentGrade: number 
}) {
  const pathData = getTimelinePath({ width, height })
  const { pathD, gradePositions, getPointOnPath } = pathData
  const currentPosition = gradePositions.find(g => g.grade === currentGrade)?.position || 0
  const currentPoint = getPointOnPath(currentPosition)

  return (
    <svg width={width} height={height} className="absolute top-0 left-0">
      {/* Arrow markers definition */}
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#8B7EC8" />
        </marker>
      </defs>
      
      {/* Main path with arrow */}
      <path
        d={pathD}
        fill="none"
        stroke="#8B7EC8"
        strokeWidth="6"
        strokeLinecap="round"
        markerEnd="url(#arrowhead)"
      />
      
      {/* Grade markers */}
      {gradePositions.map(({ grade, position }) => {
        const point = getPointOnPath(position)
        return (
          <g key={grade}>
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              fill="white"
              stroke="#8B7EC8"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={point.y - 35}
              textAnchor="middle"
              className="text-xs font-bold fill-foreground"
            >
              {grade === 9 && '9th Grade'}
              {grade === 10 && '10th Grade'}
              {grade === 11 && '11th Grade'}
              {grade === 12 && '12th Grade'}
            </text>
          </g>
        )
      })}
      
      {/* "You are here" indicator */}
      {(() => {
        // Position the "You are here" point after the current grade marker and any events
        // Add offset to position it after PSAT test date and other events at the same grade
        // Events are spaced 250px apart, so we need enough offset to clear them
        const offsetX = 300 // Fixed offset to position after events (PSAT test date is at ~250px spacing)
        const adjustedX = currentPoint.x + offsetX
        
        return (
          <g>
            <circle
              cx={adjustedX}
              cy={currentPoint.y}
              r="10"
              fill="#8B7EC8"
              stroke="white"
              strokeWidth="3"
            />
            <text
              x={adjustedX}
              y={currentPoint.y + 40}
              textAnchor="middle"
              className="text-sm font-bold fill-purple-600"
            >
              You are here!
            </text>
          </g>
        )
      })()}
    </svg>
  )
}


