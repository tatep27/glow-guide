import { useState, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { students } from '@/data/students'
import { StudentProfile } from '@/components/admin/StudentProfile'
import type { StudentProfile as StudentProfileType } from '@/types'

const gradeLabels: Record<number, string> = {
  9: 'Freshman',
  10: 'Sophomore',
  11: 'Junior',
  12: 'Senior',
}

function getInitials(name: string): string {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function getGradeColor(grade: number): string {
  const colors: Record<number, string> = {
    9: 'bg-blue-100 text-blue-800',
    10: 'bg-green-100 text-green-800',
    11: 'bg-purple-100 text-purple-800',
    12: 'bg-orange-100 text-orange-800',
  }
  return colors[grade] || 'bg-gray-100 text-gray-800'
}

export function StudentList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentProfileType | null>(null)

  const filteredStudents = useMemo(() => {
    let filtered = students

    // Filter by grade
    if (selectedGrade !== null) {
      filtered = filtered.filter((s) => s.grade === selectedGrade)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.school.toLowerCase().includes(query) ||
          s.interests.some((i) => i.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [searchQuery, selectedGrade])

  const studentsByGrade = useMemo(() => {
    const grouped: Record<number, StudentProfileType[]> = { 9: [], 10: [], 11: [], 12: [] }
    filteredStudents.forEach((student) => {
      grouped[student.grade].push(student)
    })
    return grouped
  }, [filteredStudents])

  if (selectedStudent) {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p className="text-muted-foreground">
          Student profiles are designed to help you learn about a student's interests and goals. See students' activity in forums, their current resume, and any opportunities they are exploring.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search students by name, school, or interests..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />

        {/* Grade Filters */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedGrade === null ? 'default' : 'outline'}
            onClick={() => setSelectedGrade(null)}
            className="text-sm"
          >
            All Grades
          </Button>
          {[9, 10, 11, 12].map((grade) => (
            <Button
              key={grade}
              variant={selectedGrade === grade ? 'default' : 'outline'}
              onClick={() => setSelectedGrade(grade)}
              className="text-sm"
            >
              {gradeLabels[grade]}
            </Button>
          ))}
        </div>
      </div>

      {/* Students by Grade */}
      {Object.entries(studentsByGrade).map(([grade, gradeStudents]) => {
        if (gradeStudents.length === 0) return null

        return (
          <div key={grade} className="space-y-3">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Badge className={getGradeColor(Number(grade))}>{gradeLabels[Number(grade)]}</Badge>
              <span className="text-muted-foreground">({gradeStudents.length} students)</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {gradeStudents.map((student) => (
                <Card
                  key={student.id}
                  className="border-3 border-primary/30 rounded-3xl hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => setSelectedStudent(student)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
                        {getInitials(student.name)}
                      </div>
                      <h3 className="font-bold text-lg">{student.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )
      })}

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No students found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

