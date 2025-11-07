interface OnboardingGuardProps {
  children: React.ReactNode
}

export function OnboardingGuard({ children }: OnboardingGuardProps) {
  // For demo purposes, allow access even if onboarding not completed
  // In production, you might want to check localStorage and redirect:
  // const [hasCompletedOnboarding] = useLocalStorage<boolean>('onboarding-completed', false)
  // if (!hasCompletedOnboarding) return <Navigate to="/onboarding" replace />
  
  return <>{children}</>
}

