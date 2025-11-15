import type { SpecialEvent } from '../types'

export const specialEvents: SpecialEvent[] = [
  {
    id: 'event-1',
    title: 'SAT Test Date',
    date: '2025-03-15',
    type: 'sat',
    description: 'SAT exam date - make sure to register in advance!',
    gradeLevel: 11,
  },
  {
    id: 'event-3',
    title: 'Graduation',
    date: '2026-06-15',
    type: 'milestone',
    description: 'High school graduation ceremony.',
    gradeLevel: 12,
  },
  {
    id: 'event-4',
    title: 'PSAT Test Date',
    date: '2024-10-16',
    type: 'sat',
    description: 'PSAT/NMSQT - practice for the SAT and qualify for National Merit Scholarship',
    gradeLevel: 10,
  },
  {
    id: 'event-5',
    title: 'College Fair',
    date: '2025-04-20',
    type: 'milestone',
    description: 'Annual college fair - meet with representatives from colleges and universities.',
    gradeLevel: 11,
  },
]

