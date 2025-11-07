import { useState, useEffect } from 'react'
import { WelcomeStep } from '@/components/onboarding/WelcomeStep'
import { InterestDiagnosticStep } from '@/components/onboarding/InterestDiagnosticStep'
import { ResultsStep } from '@/components/onboarding/ResultsStep'
import { useLocalStorage } from '@/hooks/useLocalStorage'

type OnboardingStep = 'welcome' | 'diagnostic' | 'results'

export function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome')
  const [selectedGrade] = useLocalStorage<number>('onboarding-grade', 10)
  const [selectedInterests, setSelectedInterests] = useLocalStorage<string[]>('onboarding-interests', [])
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>('onboarding-completed', false)

  // If already completed, redirect to dashboard (handled by App routing)
  useEffect(() => {
    if (hasCompletedOnboarding && currentStep === 'welcome') {
      // Allow re-viewing onboarding, but skip if they want to go to dashboard
    }
  }, [hasCompletedOnboarding, currentStep])

  const handleWelcomeNext = () => {
    // Skip grade selection - go directly to diagnostic
    // Grade is already set to 10 (Alex's grade) in localStorage
    setCurrentStep('diagnostic')
  }

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((i) => i !== interest)
      } else {
        return [...prev, interest]
      }
    })
  }

  const handleDiagnosticComplete = () => {
    // For demo, ensure Alex's interests are included
    const alexInterests = ['Environmental Justice', 'Art']
    const finalInterests = [...new Set([...selectedInterests, ...alexInterests])]
    setSelectedInterests(finalInterests)
    setCurrentStep('results')
  }

  const handleResultsContinue = () => {
    setHasCompletedOnboarding(true)
    // Navigation handled by ResultsStep component
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      {currentStep === 'welcome' && <WelcomeStep onNext={handleWelcomeNext} />}
      {currentStep === 'diagnostic' && (
        <InterestDiagnosticStep
          selectedInterests={selectedInterests}
          onInterestToggle={handleInterestToggle}
          onComplete={handleDiagnosticComplete}
        />
      )}
      {currentStep === 'results' && (
        <ResultsStep
          selectedInterests={selectedInterests}
          grade={selectedGrade}
          onContinue={handleResultsContinue}
        />
      )}
    </div>
  )
}
