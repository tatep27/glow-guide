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
  emoji?: string // Optional emoji for visual identification
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

// Goal Types
export interface Goal {
  id: string
  title: string
  description: string
  targetDate: string | null // ISO date string, null for ongoing
  category: 'academic' | 'career' | 'personal' | 'college'
  icon?: string
}

// Career Suggestion Types
export interface CareerSuggestion {
  id: string
  title: string
  description: string
  dayInTheLife: string[] // Array of daily activities
  resources: Array<{ title: string; link: string }> // Learning resources
  youtubeVideo?: string // YouTube video ID or URL for day-in-the-life content
  tags: string[]
  category: string
  relatedExperienceTags?: string[] // Tags from experiences that relate to this career
}

// Vote Types
export interface Vote {
  itemId: string
  itemType: 'resource' | 'career'
  vote: 'up' | 'down'
}

// Special Event Types
export interface SpecialEvent {
  id: string
  title: string
  date: string // ISO date string
  type: 'sat' | 'counselor-note' | 'milestone'
  description?: string
  gradeLevel: number // 9, 10, 11, or 12
}

// View Mode Types
export type ViewMode = 'student' | 'admin'

// Student Profile Types (Comprehensive version for admin view)
export interface CollegeApplication {
  id: string
  collegeName: string
  category: 'reach' | 'target' | 'safety'
  status: 'not-started' | 'in-progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  applicationDeadline: string // ISO date string
  decisionDate?: string // ISO date string
  notes?: string
}

export interface Essay {
  id: string
  title: string
  collegeId?: string // If associated with a specific college application
  prompt: string
  wordCount: number
  targetWordCount: number
  status: 'not-started' | 'draft' | 'in-progress' | 'completed' | 'submitted'
  deadline: string // ISO date string
  submittedDate?: string // ISO date string
}

export interface FinancialAidApplication {
  id: string
  type: 'FAFSA' | 'CSS Profile' | 'State Aid' | 'Institutional Aid' | 'Other'
  status: 'not-started' | 'in-progress' | 'submitted' | 'approved' | 'denied'
  deadline: string // ISO date string
  submittedDate?: string // ISO date string
  amountAwarded?: number
  notes?: string
}

export interface ExtracurricularActivity {
  id: string
  title: string
  organization: string
  startDate: string // ISO date string
  endDate: string | null // null for ongoing
  hoursPerWeek: number
  description: string
  role?: string
}

export interface StudentProfile {
  id: string
  name: string
  grade: number // 9, 10, 11, or 12
  school: string
  location: string
  gpa: number
  satScore?: number
  actScore?: number
  interests: string[]
  currentDate: string // ISO date string
  
  // Academics
  apCourses: string[]
  honorsCourses: string[]
  awards: string[]
  
  // Skills and Certifications
  skills: string[]
  certifications: string[]
  
  // Extracurriculars
  extracurriculars: ExtracurricularActivity[]
  
  // Future Plans
  intendedMajor?: string
  careerGoals: string[]
  
  // College Applications
  collegeApplications: CollegeApplication[]
  
  // Essays
  essays: Essay[]
  
  // Financial Aid
  financialAidApplications: FinancialAidApplication[]
  
  // Recommended Opportunities
  recommendedOpportunities: string[] // Array of opportunity IDs
}

// Admin Opportunity Types
export type AdminOpportunityType = 'Internship' | 'Program' | 'Competition' | 'Scholarship'

export interface AdminOpportunity {
  id: string
  title: string
  description: string
  type: AdminOpportunityType
  deadline: string | null // ISO date string, null if no deadline
  eligibility: string[]
  link: string | null
  tags: string[]
  location?: string
  createdBy: 'system' | 'admin' // Whether it's from existing resources or admin-created
  recommendedTo: string[] // Array of student IDs
}

