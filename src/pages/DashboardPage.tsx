import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Timeline</CardTitle>
          <CardDescription>
            Your personalized timeline will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Timeline component coming in Phase 2</p>
        </CardContent>
      </Card>
    </div>
  )
}

