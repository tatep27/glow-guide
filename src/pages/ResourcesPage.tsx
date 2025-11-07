import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ResourcesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Resource Suggestions</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personalized Resources</CardTitle>
          <CardDescription>
            Resources tailored to your interests will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Resource browsing component coming in Phase 3</p>
        </CardContent>
      </Card>
    </div>
  )
}

