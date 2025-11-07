import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

interface ResultsStepProps {
  selectedInterests: string[]
  grade: number
  onContinue?: () => void
}

export function ResultsStep({ selectedInterests, grade, onContinue }: ResultsStepProps) {
  const navigate = useNavigate()

  // For demo, show Alex's interests (Environmental Justice, Art)
  const topInterests = selectedInterests.length > 0 
    ? selectedInterests.slice(0, 5)
    : ['Environmental Justice', 'Art', 'Community Service', 'Writing', 'Leadership']
  
  // Use grade in demo note
  const gradeLabel = grade === 9 ? '9th' : grade === 10 ? '10th' : grade === 11 ? '11th' : '12th'

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    }
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">Your Interest Profile</CardTitle>
          <CardDescription className="text-lg">
            Based on your selections, here's what we've learned about your interests
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Top Interests</h3>
            <div className="flex flex-wrap gap-2">
              {topInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium">How we use this information:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Personalize resource recommendations</li>
              <li>Suggest relevant opportunities and scholarships</li>
              <li>Help you discover experiences aligned with your interests</li>
              <li>Connect you with like-minded peers in forums</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Demo Note:</strong> In this demo, you're viewing Alex's profile ({gradeLabel} grade, interested in Environmental Justice and Art). 
              Your selections help us understand how personalization works for different students.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleContinue} size="lg">
              Continue to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

