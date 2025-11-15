import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Users, ExternalLink, ArrowLeft } from 'lucide-react'
import { OpportunityForm } from './OpportunityForm'
import { resources } from '@/data/resources'
import { students } from '@/data/students'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { AdminOpportunity, AdminOpportunityType } from '@/types'

export function OpportunitiesManagement() {
  const [showForm, setShowForm] = useState(false)
  const [editingOpportunity, setEditingOpportunity] = useState<AdminOpportunity | null>(null)
  const [recommendingFor, setRecommendingFor] = useState<AdminOpportunity | null>(null)
  const [adminOpportunities, setAdminOpportunities] = useLocalStorage<AdminOpportunity[]>('admin-opportunities', [])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState<AdminOpportunityType | 'all'>('all')

  // Convert existing resources to AdminOpportunity format
  const systemOpportunities: AdminOpportunity[] = useMemo(() => {
    const systemRecommendations = JSON.parse(localStorage.getItem('system-opportunity-recommendations') || '{}')
    return resources.map((resource) => ({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      type: mapResourceTypeToAdminType(resource.type),
      deadline: resource.deadline,
      eligibility: resource.eligibility,
      link: resource.link,
      tags: resource.tags,
      location: resource.location,
      createdBy: 'system',
      recommendedTo: systemRecommendations[resource.id] || [],
    }))
  }, [])

  const allOpportunities = [...systemOpportunities, ...adminOpportunities]

  const filteredOpportunities = useMemo(() => {
    let filtered = allOpportunities

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((opp) => opp.type === selectedType)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (opp) =>
          opp.title.toLowerCase().includes(query) ||
          opp.description.toLowerCase().includes(query) ||
          opp.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [allOpportunities, selectedType, searchQuery])

  const handleSaveOpportunity = (opportunity: Omit<AdminOpportunity, 'id' | 'createdBy' | 'recommendedTo'>) => {
    if (editingOpportunity) {
      // Update existing
      setAdminOpportunities((prev) =>
        prev.map((opp) => (opp.id === editingOpportunity.id ? { ...opportunity, id: opp.id, createdBy: 'admin', recommendedTo: opp.recommendedTo } : opp))
      )
      setEditingOpportunity(null)
    } else {
      // Create new
      const newOpportunity: AdminOpportunity = {
        ...opportunity,
        id: `admin-opp-${Date.now()}`,
        createdBy: 'admin',
        recommendedTo: [],
      }
      setAdminOpportunities((prev) => [...prev, newOpportunity])
    }
    setShowForm(false)
  }

  const handleDeleteOpportunity = (id: string) => {
    setAdminOpportunities((prev) => prev.filter((opp) => opp.id !== id))
  }

  const handleRecommendToStudents = (opportunityId: string, studentIds: string[]) => {
    // Update admin opportunities
    setAdminOpportunities((prev) =>
      prev.map((opp) => (opp.id === opportunityId ? { ...opp, recommendedTo: studentIds } : opp))
    )
    // For system opportunities, we'd need to store recommendations separately
    // For demo, we'll create a mapping in localStorage
    const systemRecommendations = JSON.parse(localStorage.getItem('system-opportunity-recommendations') || '{}')
    systemRecommendations[opportunityId] = studentIds
    localStorage.setItem('system-opportunity-recommendations', JSON.stringify(systemRecommendations))
    
    // Also update student profiles to include this opportunity
    const studentProfiles = JSON.parse(localStorage.getItem('student-recommended-opportunities') || '{}')
    students.forEach((student) => {
      if (!studentProfiles[student.id]) {
        studentProfiles[student.id] = []
      }
      if (studentIds.includes(student.id) && !studentProfiles[student.id].includes(opportunityId)) {
        studentProfiles[student.id].push(opportunityId)
      } else if (!studentIds.includes(student.id)) {
        studentProfiles[student.id] = studentProfiles[student.id].filter((id: string) => id !== opportunityId)
      }
    })
    localStorage.setItem('student-recommended-opportunities', JSON.stringify(studentProfiles))
    
    setRecommendingFor(null)
  }

  if (showForm || editingOpportunity) {
    return (
      <OpportunityForm
        opportunity={editingOpportunity || undefined}
        onSave={handleSaveOpportunity}
        onCancel={() => {
          setShowForm(false)
          setEditingOpportunity(null)
        }}
      />
    )
  }

  if (recommendingFor) {
    return (
      <RecommendationDialog
        opportunity={recommendingFor}
        onSave={(studentIds) => handleRecommendToStudents(recommendingFor.id, studentIds)}
        onCancel={() => setRecommendingFor(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">All Opportunities</h2>
          <p className="text-muted-foreground">Find opportunities and resources to recommend to students, or add your own using the add opportunity button. These opportunities will appear on students' own view.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Opportunity
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Search opportunities..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border-2 border-primary/30 rounded-lg bg-background focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
        />

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedType === 'all' ? 'default' : 'outline'}
            onClick={() => setSelectedType('all')}
            className="text-sm"
          >
            All Types
          </Button>
          {(['Internship', 'Program', 'Competition', 'Scholarship'] as AdminOpportunityType[]).map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? 'default' : 'outline'}
              onClick={() => setSelectedType(type)}
              className="text-sm"
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filteredOpportunities.map((opportunity) => (
          <OpportunityCard
            key={opportunity.id}
            opportunity={opportunity}
            onEdit={() => {
              if (opportunity.createdBy === 'admin') {
                setEditingOpportunity(opportunity)
                setShowForm(true)
              }
            }}
            onDelete={() => {
              if (opportunity.createdBy === 'admin') {
                handleDeleteOpportunity(opportunity.id)
              }
            }}
            onRecommend={(opp) => setRecommendingFor(opp)}
          />
        ))}
      </div>

      {filteredOpportunities.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No opportunities found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}

function OpportunityCard({
  opportunity,
  onEdit,
  onDelete,
  onRecommend,
}: {
  opportunity: AdminOpportunity
  onEdit: () => void
  onDelete: () => void
  onRecommend: (opp: AdminOpportunity) => void
}) {
  const recommendedStudents = students.filter((s) => opportunity.recommendedTo.includes(s.id))

  return (
    <Card className="border-3 border-primary/30 rounded-3xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle>{opportunity.title}</CardTitle>
              <Badge variant={opportunity.createdBy === 'admin' ? 'default' : 'secondary'}>
                {opportunity.type}
              </Badge>
              {opportunity.createdBy === 'admin' && <Badge variant="outline">Admin Created</Badge>}
            </div>
            <p className="text-muted-foreground">{opportunity.description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {opportunity.tags.map((tag, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {opportunity.deadline && (
            <div>
              <span className="text-muted-foreground">Deadline: </span>
              <span className="font-medium">{new Date(opportunity.deadline).toLocaleDateString()}</span>
            </div>
          )}
          {opportunity.location && (
            <div>
              <span className="text-muted-foreground">Location: </span>
              <span className="font-medium">{opportunity.location}</span>
            </div>
          )}
        </div>

        {opportunity.eligibility.length > 0 && (
          <div>
            <p className="text-sm font-semibold mb-1">Eligibility:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
              {opportunity.eligibility.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
        )}

        {recommendedStudents.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Users className="h-4 w-4" />
            <span className="text-sm">
              Recommended to {recommendedStudents.length} student(s):{' '}
              {recommendedStudents.map((s) => s.name).join(', ')}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          {opportunity.link && (
            <Button variant="outline" size="sm" asChild>
              <a href={opportunity.link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Link
              </a>
            </Button>
          )}
          {opportunity.createdBy === 'admin' && (
            <>
              <Button variant="outline" size="sm" onClick={onEdit}>
                Edit
              </Button>
              <Button variant="outline" size="sm" onClick={onDelete}>
                Delete
              </Button>
            </>
          )}
          <Button variant="default" size="sm" onClick={() => onRecommend(opportunity)}>
            <Users className="h-4 w-4 mr-2" />
            Recommend to Students
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationDialog({
  opportunity,
  onSave,
  onCancel,
}: {
  opportunity: AdminOpportunity
  onSave: (studentIds: string[]) => void
  onCancel: () => void
}) {
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(opportunity.recommendedTo || [])
  const [searchQuery, setSearchQuery] = useState('')

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">Recommend: {opportunity.title}</h2>
      </div>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Select Students</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="text"
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background"
          />

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredStudents.map((student) => (
              <label
                key={student.id}
                className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted"
              >
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(student.id)}
                  onChange={() => toggleStudent(student.id)}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Grade {student.grade} • {student.school}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button onClick={() => onSave(selectedStudentIds)}>
              Recommend to {selectedStudentIds.length} Student(s)
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function mapResourceTypeToAdminType(resourceType: string): AdminOpportunityType {
  const mapping: Record<string, AdminOpportunityType> = {
    scholarship: 'Scholarship',
    paid: 'Internship',
    afterschool: 'Program',
    event: 'Program',
    'club-fair': 'Program',
  }
  return mapping[resourceType] || 'Program'
}

