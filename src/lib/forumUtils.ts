import { students } from '@/data/students'

/**
 * Maps an authorId to a real student name for admin view
 * Returns the original authorName if not a student or not found
 */
export function getAuthorDisplayName(authorId: string, authorName: string, isAdmin: boolean): string {
  // If not admin, return the anonymous name
  if (!isAdmin) {
    return authorName
  }

  // If it's a counselor, return the name as-is
  if (authorId.startsWith('counselor-')) {
    return authorName
  }

  // Try to match student ID patterns
  // Pattern 1: 'student-X' format (matches students.ts IDs like 'student-1')
  if (authorId.startsWith('student-')) {
    const studentId = authorId
    const student = students.find((s) => s.id === studentId)
    if (student) {
      return student.name
    }
  }

  // Pattern 2: 'Student_X' format (anonymous IDs from forum data)
  // Create a deterministic mapping based on the number
  if (authorName.startsWith('Student_')) {
    const match = authorName.match(/Student_(\d+)/)
    if (match) {
      const num = parseInt(match[1], 10)
      // Map to students sequentially (modulo to cycle through available students)
      const studentIndex = num % students.length
      return students[studentIndex]?.name || authorName
    }
  }

  // Fallback: return original name
  return authorName
}

