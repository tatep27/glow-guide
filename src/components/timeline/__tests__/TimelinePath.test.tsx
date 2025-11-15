import { describe, it, expect } from 'vitest'
import { getTimelinePath } from '../TimelinePath'

describe('getTimelinePath', () => {
  it('returns path data with correct structure', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    expect(result).toHaveProperty('pathD')
    expect(result).toHaveProperty('gradePositions')
    expect(result).toHaveProperty('getPointOnPath')
  })

  it('returns grade positions for all grades', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    expect(result.gradePositions).toHaveLength(4)
    expect(result.gradePositions.map(g => g.grade)).toEqual([9, 10, 11, 12])
  })

  it('calculates correct positions for grades', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    const grade9 = result.gradePositions.find(g => g.grade === 9)
    const grade12 = result.gradePositions.find(g => g.grade === 12)
    
    expect(grade9?.position).toBe(0)
    expect(grade12?.position).toBe(1)
  })

  it('getPointOnPath returns valid coordinates', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    const point = result.getPointOnPath(0.5)
    
    expect(point).toHaveProperty('x')
    expect(point).toHaveProperty('y')
    expect(point.x).toBeGreaterThan(0)
    expect(point.x).toBeLessThanOrEqual(1000)
    expect(point.y).toBeGreaterThan(0)
    expect(point.y).toBeLessThanOrEqual(400)
  })

  it('getPointOnPath returns correct start position', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    const point = result.getPointOnPath(0)
    
    expect(point.x).toBe(0)
    expect(point.y).toBeCloseTo(200, 1) // Center of height
  })

  it('getPointOnPath returns correct end position', () => {
    const result = getTimelinePath({ width: 1000, height: 400 })
    
    const point = result.getPointOnPath(1)
    
    expect(point.x).toBe(1000)
    expect(point.y).toBeCloseTo(200, 1) // Center of height
  })
})

