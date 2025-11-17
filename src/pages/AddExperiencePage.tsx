import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useExperiences } from '@/hooks/useExperiences'
import { alexProfile } from '@/data/alexProfile'
import { ArrowLeft, Info, Calendar, Tag, Type, GraduationCap } from 'lucide-react'
import type { Experience } from '@/types'

export function AddExperiencePage() {
  const navigate = useNavigate()
  const { addExperience } = useExperiences()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'activity' as Experience['type'],
    startDate: '',
    endDate: '',
    isPresent: false,
    tags: '',
    gradeLevel: alexProfile.grade,
    emoji: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const newErrors: Record<string, string> = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }
    if (!formData.isPresent && !formData.endDate) {
      newErrors.endDate = 'End date is required if not present'
    }
    if (formData.startDate && formData.endDate && !formData.isPresent) {
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        newErrors.endDate = 'End date must be after start date'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Parse tags
    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0)

    // Add experience
    addExperience({
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.isPresent ? null : formData.endDate,
      tags,
      gradeLevel: formData.gradeLevel,
      emoji: formData.emoji.trim() || undefined,
    })

    // Navigate back to dashboard
    navigate('/')
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/')}
          className="rounded-full"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Add New Experience</h1>
          <p className="text-muted-foreground">
            Document your activities, volunteer work, jobs, or awards
          </p>
        </div>
      </div>

      {/* Info Card */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">How this appears on your profile</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Timeline:</strong> Your experience will appear on your timeline at the
                    appropriate grade level and date, helping you visualize your journey.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Resume:</strong> Your experience will automatically be included in your
                    resume, formatted professionally with dates, description, and organization
                    details.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>
                    <strong>Skills & Tags:</strong> Tags you add will be extracted as skills on your
                    resume and help match you with relevant opportunities.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Experience Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Experience Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="e.g., Environmental Club Member, Summer Intern at Tech Company"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {errors.title && <p className="text-sm text-destructive mt-1">{errors.title}</p>}
            </div>

            {/* Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Type className="h-4 w-4" />
                Experience Type <span className="text-destructive">*</span>
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="activity">Activity / Extracurricular</option>
                <option value="volunteer">Volunteer Work</option>
                <option value="work">Work / Job / Internship</option>
                <option value="award">Award / Recognition</option>
              </select>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Describe what you did, your responsibilities, and any achievements. This will appear on your resume, so write it professionally. For example: 'Active member of the school's Environmental Club. Participates in campus recycling initiatives and organizes local clean-up drives in Boston neighborhoods. Helps coordinate monthly environmental awareness events.'"
                rows={6}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Tip: Write in complete sentences, similar to how you would describe it on a resume.
                Include specific actions, responsibilities, and accomplishments.
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Start Date <span className="text-destructive">*</span>
                </label>
                <input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium mb-2">
                  End Date
                </label>
                <input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  disabled={formData.isPresent}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed"
                />
                {errors.endDate && (
                  <p className="text-sm text-destructive mt-1">{errors.endDate}</p>
                )}
                <label className="flex items-center gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPresent}
                    onChange={(e) => handleChange('isPresent', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">I'm currently doing this</span>
                </label>
              </div>
            </div>

            {/* Grade Level */}
            <div>
              <label htmlFor="gradeLevel" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Grade Level <span className="text-destructive">*</span>
              </label>
              <select
                id="gradeLevel"
                value={formData.gradeLevel}
                onChange={(e) => handleChange('gradeLevel', parseInt(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value={9}>9th Grade</option>
                <option value={10}>10th Grade</option>
                <option value={11}>11th Grade</option>
                <option value={12}>12th Grade</option>
              </select>
            </div>

            {/* Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags (comma-separated)
              </label>
              <input
                id="tags"
                type="text"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
                placeholder="e.g., Leadership, Community Service, Environmental Justice"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tags help categorize your experience and will appear as skills on your resume.
              </p>
            </div>

            {/* Emoji (Optional) */}
            <div>
              <label htmlFor="emoji" className="block text-sm font-medium mb-2">
                Emoji (Optional)
              </label>
              <input
                id="emoji"
                type="text"
                value={formData.emoji}
                onChange={(e) => handleChange('emoji', e.target.value)}
                placeholder="e.g., 🌱, 🎨, 🌿"
                maxLength={2}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Add an emoji to make your experience stand out on your timeline.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button type="submit">Add Experience</Button>
        </div>
      </form>
    </div>
  )
}

