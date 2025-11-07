import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface GradeSelectionStepProps {
  selectedGrade: number
  onGradeSelect: (grade: number) => void
  onNext: () => void
}

export function GradeSelectionStep({ selectedGrade, onGradeSelect, onNext }: GradeSelectionStepProps) {
  const grades = [9, 10, 11, 12]

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Grade</CardTitle>
          <CardDescription>
            Choose your current grade level to personalize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {grades.map((grade) => (
              <Button
                key={grade}
                variant={selectedGrade === grade ? 'default' : 'outline'}
                size="lg"
                className="h-20 text-lg"
                onClick={() => onGradeSelect(grade)}
              >
                {grade === 9 && '9th Grade'}
                {grade === 10 && '10th Grade'}
                {grade === 11 && '11th Grade'}
                {grade === 12 && '12th Grade'}
              </Button>
            ))}
          </div>
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Demo:</strong> This demo uses a 10th grade student profile. Your selection helps us understand how the platform adapts to different grade levels.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={onNext} size="lg" disabled={!selectedGrade}>
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

