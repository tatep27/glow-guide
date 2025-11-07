// User Profile Types
export interface UserProfile {
  name: string
  grade: number
  school: string
  location: string
  gpa: number
  interests: string[]
  currentDate: string // ISO date string
}

// Experience Types
export interface Experience {
  id: string
  title: string
  description: string
  startDate: string // ISO date string
  endDate: string | null // null for "Present"
  tags: string[]
  type: 'activity' | 'volunteer' | 'work' | 'award'
  gradeLevel: number // 9, 10, 11, or 12
}

// Resource Types
export type ResourceType = 'scholarship' | 'afterschool' | 'paid' | 'club-fair' | 'event'

export interface Resource {
  id: string
  title: string
  type: ResourceType
  description: string
  deadline: string | null // ISO date string, null if no deadline
  eligibility: string[]
  link: string | null
  tags: string[]
  location?: string // Boston-area, MA-specific, etc.
}

// Timeline Event Types
export interface TimelineEvent {
  id: string
  type: 'experience' | 'resource'
  data: Experience | Resource
  position: {
    grade: number // 9, 10, 11, or 12
    date?: string // Optional specific date
  }
}

// Forum Types
export interface ForumPost {
  id: string
  authorId: string // Anonymous student ID or counselor ID
  authorName: string // "Student_42" or "Counselor Smith"
  content: string
  timestamp: string // ISO date string
  likes: number
  isCounselor: boolean
  parentId?: string // For threaded replies
}

export interface ForumThread {
  id: string
  forumId: string
  title: string
  authorId: string
  authorName: string
  isCounselor: boolean
  posts: ForumPost[]
  createdAt: string // ISO date string
  lastActivity: string // ISO date string
}

export interface Forum {
  id: string
  title: string
  description: string
  createdBy: string // Counselor name
  threads: ForumThread[]
}

// Interest Diagnostic Types
export interface InterestDiagnostic {
  academicInterests: string[]
  extracurricularInterests: string[]
  careerAspirations: string[]
  values: string[]
  creativeInterests: string[]
  scores: Record<string, number> // Interest category -> score
}

// Resume Types
export interface ResumeData {
  education: {
    school: string
    gpa: number
    expectedGraduation: string // Year
  }
  experiences: Array<{
    title: string
    organization: string
    startDate: string
    endDate: string | null
    description: string
  }>
  skills: string[]
  activities: string[]
}

