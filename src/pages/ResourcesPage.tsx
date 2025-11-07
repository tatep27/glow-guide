import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ResourceFilter } from '@/components/resources/ResourceFilter'
import { ResourceList } from '@/components/resources/ResourceList'
import { ResourceDetail } from '@/components/resources/ResourceDetail'
import { resources } from '@/data/resources'
import { getPersonalizedResources } from '@/lib/personalization'
import type { Resource, ResourceType } from '@/types'

export function ResourcesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedTypes, setSelectedTypes] = useState<ResourceType[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)

  // Check if resource ID is in URL (from timeline click)
  useEffect(() => {
    const resourceIdFromUrl = searchParams.get('id')
    if (resourceIdFromUrl) {
      const resource = resources.find((r) => r.id === resourceIdFromUrl)
      if (resource) {
        setSelectedResource(resource)
        setSearchParams({}) // Clear URL param after reading
      }
    }
  }, [searchParams, setSearchParams])

  // Get personalized resources
  const { recommended, all } = useMemo(() => getPersonalizedResources(resources), [])

  // Filter resources
  const filteredResources = useMemo(() => {
    let filtered = all

    // Filter by type
    if (selectedTypes.length > 0) {
      filtered = filtered.filter((r) => selectedTypes.includes(r.type))
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [all, selectedTypes, searchQuery])

  // Filter recommended resources
  const filteredRecommended = useMemo(() => {
    let filtered = recommended

    if (selectedTypes.length > 0) {
      filtered = filtered.filter((r) => selectedTypes.includes(r.type))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (r) =>
          r.title.toLowerCase().includes(query) ||
          r.description.toLowerCase().includes(query) ||
          r.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [recommended, selectedTypes, searchQuery])

  const handleTypeToggle = (type: ResourceType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  const handleResourceClick = (resource: Resource) => {
    setSelectedResource(resource)
  }

  const showRecommended = filteredRecommended.length > 0 && selectedTypes.length === 0 && !searchQuery.trim()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Resource Suggestions
        </h1>
        <p className="text-muted-foreground text-lg">
          Discover opportunities tailored to your interests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-r from-muted via-muted/50 to-muted p-6 rounded-lg border-2 border-primary/20">
        <ResourceFilter
          selectedTypes={selectedTypes}
          onTypeToggle={handleTypeToggle}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Recommended Section */}
      {showRecommended && (
        <ResourceList
          resources={filteredRecommended}
          title="Recommended for You"
          showMatchReason={true}
          onResourceClick={handleResourceClick}
        />
      )}

      {/* All Resources */}
      <ResourceList
        resources={filteredResources}
        title={showRecommended ? 'All Resources' : 'Resources'}
        onResourceClick={handleResourceClick}
      />

      {/* Resource Detail Modal */}
      {selectedResource && (
        <ResourceDetail
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}
    </div>
  )
}
