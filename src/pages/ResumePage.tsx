import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ResumePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Resume Builder</h1>
      <Card>
        <CardHeader>
          <CardTitle>Your Resume</CardTitle>
          <CardDescription>
            Your resume will be auto-populated from your experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Resume builder component coming in Phase 4</p>
        </CardContent>
      </Card>
    </div>
  )
}

