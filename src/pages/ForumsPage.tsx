import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForumsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Community Forums</h1>
      <Card>
        <CardHeader>
          <CardTitle>Forums</CardTitle>
          <CardDescription>
            Connect with other students and counselors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Forum component coming in Phase 5</p>
        </CardContent>
      </Card>
    </div>
  )
}

