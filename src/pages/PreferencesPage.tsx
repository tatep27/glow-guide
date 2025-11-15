import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { ResourceType } from '@/types'

export interface OpportunityPreferences {
  types: ResourceType[]
  location: string[]
  tags: string[]
  counselorMessage?: string
}

const opportunityTypes: { value: ResourceType; label: string; description: string }[] = [
  { value: 'scholarship', label: 'Scholarships', description: 'Financial aid and scholarship opportunities' },
  { value: 'afterschool', label: 'Programs', description: 'Afterschool and enrichment programs' },
  { value: 'paid', label: 'Jobs & Paid', description: 'Paid internships and job opportunities' },
  { value: 'club-fair', label: 'Club Fairs', description: 'School club and organization events' },
  { value: 'event', label: 'Events', description: 'Workshops, conferences, and networking events' },
]

const commonTags = [
  'STEM',
  'Arts',
  'Environmental Justice',
  'Community Service',
  'Leadership',
  'Sports',
  'Music',
  'Writing',
  'Research',
  'Entrepreneurship',
  'Social Justice',
  'Education',
  'Healthcare',
  'Technology',
  'Business',
]

const locations = ['Boston', 'Massachusetts', 'Remote', 'Nationwide']

export function PreferencesPage() {
  // For demo: Alex corresponds to student-1 in admin view
  // In a real app, this would come from authentication/user context
  const currentStudentId = 'student-1' // Alex Johnson
  
  const [preferences, setPreferences] = useLocalStorage<OpportunityPreferences>('opportunity-preferences', {
    types: ['scholarship', 'afterschool', 'paid'],
    location: ['Boston', 'Massachusetts'],
    tags: [],
  })

  // Get student-specific preferences for the message
  const studentPreferences = JSON.parse(
    localStorage.getItem(`student-preferences-${currentStudentId}`) || '{}'
  )

  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>(preferences.types)
  const [selectedLocations, setSelectedLocations] = useState<string[]>(preferences.location)
  const [selectedTags, setSelectedTags] = useState<string[]>(preferences.tags)
  const [counselorMessage, setCounselorMessage] = useState<string>(
    studentPreferences.counselorMessage || preferences.counselorMessage || ''
  )

  const handleTypeToggle = (type: ResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleLocationToggle = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    )
  }

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  const handleSave = () => {
    // Save general preferences
    setPreferences({
      types: selectedTypes,
      location: selectedLocations,
      tags: selectedTags,
    })
    
    // Save counselor message to student-specific storage
    const studentPrefs = {
      ...studentPreferences,
      counselorMessage: counselorMessage,
    }
    localStorage.setItem(`student-preferences-${currentStudentId}`, JSON.stringify(studentPrefs))
    
    // Show success message or navigate back
    alert('Preferences saved! Your opportunity recommendations will be updated.')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Update Preferences</h1>
          <p className="text-muted-foreground">Customize what types of opportunities you want to see</p>
        </div>
      </div>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Opportunity Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select the types of opportunities you're interested in receiving recommendations for.
          </p>
          <div className="space-y-3">
            {opportunityTypes.map((type) => (
              <label
                key={type.value}
                className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.value)}
                  onChange={() => handleTypeToggle(type.value)}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Locations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose locations where you're interested in opportunities.
          </p>
          <div className="flex flex-wrap gap-2">
            {locations.map((location) => (
              <Badge
                key={location}
                variant={selectedLocations.includes(location) ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => handleLocationToggle(location)}
              >
                {location}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Interest Tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select tags that match your interests. Opportunities matching these tags will be prioritized.
          </p>
          <div className="flex flex-wrap gap-2">
            {commonTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                className="cursor-pointer px-3 py-1 text-sm"
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-3 border-primary/30 rounded-3xl">
        <CardHeader>
          <CardTitle>Message for Counselor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Write a message that your school counselor can see when they open your profile.
          </p>
          <textarea
            value={counselorMessage}
            onChange={(e) => setCounselorMessage(e.target.value)}
            placeholder="Write your message here..."
            className="w-full min-h-[120px] p-4 border-2 border-primary/30 rounded-xl resize-y focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background text-foreground"
          />
        </CardContent>
      </Card>

      <div className="flex items-center gap-4">
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
        <Link to="/">
          <Button variant="outline" size="lg">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  )
}

