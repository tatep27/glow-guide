import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function OnboardingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome</h1>
      <Card>
        <CardHeader>
          <CardTitle>Onboarding</CardTitle>
          <CardDescription>
            Complete your interest diagnostic to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Onboarding flow coming in Phase 1</p>
        </CardContent>
      </Card>
    </div>
  )
}

