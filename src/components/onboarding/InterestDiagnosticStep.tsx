import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface InterestDiagnosticStepProps {
  selectedInterests: string[]
  onInterestToggle: (interest: string) => void
  onComplete: () => void
}

const interestCategories = [
  {
    title: 'Academic Interests',
    interests: ['Science', 'Math', 'English', 'Social Studies', 'History', 'Foreign Languages'],
  },
  {
    title: 'Extracurricular Activities',
    interests: ['Sports', 'Music', 'Art', 'Theater', 'Debate', 'Robotics', 'Environmental Club', 'Writing'],
  },
  {
    title: 'Career Interests',
    interests: ['Engineering', 'Medicine', 'Law', 'Education', 'Business', 'Arts', 'Journalism', 'Environmental Policy'],
  },
  {
    title: 'Values & Causes',
    interests: ['Environmental Justice', 'Social Justice', 'Community Service', 'Education Equity', 'Climate Action'],
  },
  {
    title: 'Creative Interests',
    interests: ['Visual Arts', 'Writing', 'Design', 'Music', 'Photography', 'Digital Media'],
  },
]

export function InterestDiagnosticStep({ selectedInterests, onInterestToggle, onComplete }: InterestDiagnosticStepProps) {
  const [currentCategory, setCurrentCategory] = useState(0)
  const currentCategoryData = interestCategories[currentCategory]
  const progress = ((currentCategory + 1) / interestCategories.length) * 100

  const handleNext = () => {
    if (currentCategory < interestCategories.length - 1) {
      setCurrentCategory(currentCategory + 1)
    } else {
      onComplete()
    }
  }

  const handleBack = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Interest Diagnostic</CardTitle>
          <CardDescription>
            Select the interests that resonate with you. This helps us personalize your experience.
          </CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              Step {currentCategory + 1} of {interestCategories.length}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">{currentCategoryData.title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {currentCategoryData.interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest)
                return (
                  <Button
                    key={interest}
                    variant={isSelected ? 'default' : 'outline'}
                    className="h-auto py-3 px-4 text-left justify-start"
                    onClick={() => onInterestToggle(interest)}
                  >
                    {interest}
                  </Button>
                )
              })}
            </div>
          </div>
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentCategory === 0}
            >
              Back
            </Button>
            <Button onClick={handleNext} size="lg">
              {currentCategory === interestCategories.length - 1 ? 'Complete' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

