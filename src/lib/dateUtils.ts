import { format, parseISO, differenceInDays, isBefore } from 'date-fns'

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'MMM yyyy')
}

export function formatDateRange(startDate: string, endDate: string | null): string {
  const start = formatDate(startDate)
  const end = endDate ? formatDate(endDate) : 'Present'
  return `${start} - ${end}`
}

export function getDeadlineUrgency(deadline: string | null): 'urgent' | 'soon' | 'upcoming' | null {
  if (!deadline) return null
  
  const deadlineDate = parseISO(deadline)
  const today = new Date()
  const daysUntil = differenceInDays(deadlineDate, today)
  
  if (daysUntil < 0) return null // Past deadline
  if (daysUntil <= 30) return 'urgent'
  if (daysUntil <= 90) return 'soon'
  return 'upcoming'
}

export function isCurrentExperience(endDate: string | null): boolean {
  if (!endDate) return true // Ongoing experience
  const end = parseISO(endDate)
  const today = new Date()
  return isBefore(today, end) || end.getTime() === today.getTime()
}

