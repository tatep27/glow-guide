import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Edit2, Save, X } from 'lucide-react'
import { experiences } from '@/data/experiences'
import { alexProfile } from '@/data/alexProfile'
import { generateResumeFromExperiences } from '@/lib/resumeGenerator'
import type { ResumeData } from '@/types'
import { formatDateRange } from '@/lib/dateUtils'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function ResumeBuilder() {
  const [isEditing, setIsEditing] = useState(false)
  const [resumeData, setResumeData] = useLocalStorage<ResumeData | null>('resume-data', null)

  // Generate initial resume from experiences
  const generatedResume = useMemo(() => generateResumeFromExperiences(experiences), [])
  const displayResume = resumeData || generatedResume

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSave = () => {
    setResumeData(displayResume)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (!resumeData) {
      // Reset to generated if no saved data
      setResumeData(null)
    }
  }

  const handleExportPDF = () => {
    // For PoC, we'll use window.print() which allows users to save as PDF
    window.print()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resume Builder</h1>
          <p className="text-muted-foreground">
            Your resume is automatically generated from your experiences
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Resume Preview */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg border-2 border-primary/20 print:p-0 print:shadow-none print:border-0">
        <ResumePreview resume={displayResume} />
      </div>
    </div>
  )
}

interface ResumePreviewProps {
  resume: ResumeData
}

function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center border-b-2 border-primary pb-4">
        <h1 className="text-3xl font-bold mb-2">{alexProfile.name}</h1>
        <div className="text-muted-foreground space-y-1">
          <p>{alexProfile.location}</p>
          <p>{alexProfile.school}</p>
        </div>
      </div>

      {/* Education */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b border-primary/30 pb-1">Education</h2>
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{resume.education.school}</p>
              <p className="text-sm text-muted-foreground">
                Expected Graduation: {resume.education.expectedGraduation}
              </p>
            </div>
            <p className="font-semibold">GPA: {resume.education.gpa.toFixed(1)}/4.0</p>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section>
        <h2 className="text-xl font-bold mb-3 border-b border-primary/30 pb-1">Experience</h2>
        <div className="space-y-4">
          {resume.experiences.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-semibold">{exp.title}</p>
                  <p className="text-sm text-muted-foreground">{exp.organization}</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">
                  {formatDateRange(exp.startDate, exp.endDate)}
                </p>
              </div>
              <p className="text-sm mt-1">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      {resume.activities.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3 border-b border-primary/30 pb-1">Activities</h2>
          <div className="flex flex-wrap gap-2">
            {resume.activities.map((activity, index) => (
              <Badge key={index} variant="secondary">
                {activity}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-3 border-b border-primary/30 pb-1">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, index) => (
              <Badge key={index} variant="outline">
                {skill}
              </Badge>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

