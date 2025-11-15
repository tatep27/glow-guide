import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { AdminOpportunity, AdminOpportunityType } from '@/types'

interface OpportunityFormProps {
  opportunity?: AdminOpportunity
  onSave: (opportunity: Omit<AdminOpportunity, 'id' | 'createdBy' | 'recommendedTo'>) => void
  onCancel: () => void
}

export function OpportunityForm({ opportunity, onSave, onCancel }: OpportunityFormProps) {
  const [title, setTitle] = useState(opportunity?.title || '')
  const [description, setDescription] = useState(opportunity?.description || '')
  const [type, setType] = useState<AdminOpportunityType>(opportunity?.type || 'Program')
  const [deadline, setDeadline] = useState(opportunity?.deadline || '')
  const [link, setLink] = useState(opportunity?.link || '')
  const [location, setLocation] = useState(opportunity?.location || '')
  const [eligibilityInput, setEligibilityInput] = useState(opportunity?.eligibility.join(', ') || '')
  const [tagsInput, setTagsInput] = useState(opportunity?.tags.join(', ') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const eligibility = eligibilityInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
    const tags = tagsInput
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    onSave({
      title,
      description,
      type,
      deadline: deadline || null,
      link: link || null,
      location: location || undefined,
      eligibility,
      tags,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h2 className="text-2xl font-bold">{opportunity ? 'Edit Opportunity' : 'Add New Opportunity'}</h2>
      </div>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Opportunity Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AdminOpportunityType)}
                required
                className="w-full px-4 py-2 border rounded-lg bg-background"
              >
                <option value="Internship">Internship</option>
                <option value="Program">Program</option>
                <option value="Competition">Competition</option>
                <option value="Scholarship">Scholarship</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Boston, MA"
                  className="w-full px-4 py-2 border rounded-lg bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Eligibility (comma-separated)</label>
              <input
                type="text"
                value={eligibilityInput}
                onChange={(e) => setEligibilityInput(e.target.value)}
                placeholder="e.g., High school student, GPA 3.5+, Community service"
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., STEM, Paid, Summer"
                className="w-full px-4 py-2 border rounded-lg bg-background"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button type="submit">Save Opportunity</Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

