import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface WelcomeStepProps {
  onNext: () => void
}

export function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl mb-4">Welcome to Career Readiness Platform</CardTitle>
          <CardDescription className="text-lg">
            This is a demo experience showcasing how we help students navigate their career and college readiness journey.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">What you'll explore:</h3>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Your personalized timeline showing experiences and upcoming opportunities</li>
              <li>Resource suggestions tailored to your interests</li>
              <li>An auto-generated resume builder</li>
              <li>Community forums for questions and support</li>
            </ul>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Demo:</strong> This is a demonstration of the onboarding flow. You'll be viewing a demo student profile (Alex, 10th grade) to see how the platform works.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onNext} size="lg">
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

