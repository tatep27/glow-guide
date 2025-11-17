import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

export function WelcomeModal() {
  const [hasSeenWelcome, setHasSeenWelcome] = useLocalStorage<boolean>('has-seen-welcome', false)
  // Initialize isOpen based on whether user has seen welcome
  const [isOpen, setIsOpen] = useState(() => {
    // Check localStorage directly on initial render
    try {
      const item = window.localStorage.getItem('has-seen-welcome')
      const shouldShow = !item || !JSON.parse(item) // Show if not found or false
      console.log('WelcomeModal init:', { item, shouldShow })
      return shouldShow
    } catch (error) {
      console.log('WelcomeModal init error:', error)
      return true // Show on error
    }
  })

  useEffect(() => {
    // Update isOpen when hasSeenWelcome changes
    setIsOpen(!hasSeenWelcome)
  }, [hasSeenWelcome])

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    console.log('WelcomeModal: handleClose called')
    setIsOpen(false)
    setHasSeenWelcome(true)
  }

  // Debug: log when modal should show
  useEffect(() => {
    if (isOpen) {
      console.log('WelcomeModal: Modal is open and should be visible')
    }
  }, [isOpen])

  // Always render something to test if component is mounting
  console.log('WelcomeModal render:', { isOpen, hasSeenWelcome })

  if (!isOpen) {
    return null
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4" 
      onClick={handleClose}
      style={{ 
        zIndex: 1000,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Card 
        className="max-w-2xl w-full shadow-2xl bg-card" 
        onClick={(e) => e.stopPropagation()}
        style={{ zIndex: 1001 }}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-2xl">Welcome to GlowGuide</CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={(e) => {
                e.stopPropagation()
                handleClose(e)
              }}
              type="button"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            This is a proof-of-concept demo of GlowGuide, built to showcase the core experience for students and school staff. 
            You can switch between the student-facing and admin-facing views at any time by clicking the toggle in the top-left corner. 
            This demo is only a sample—features, data, and interactions are simplified to highlight the vision of the platform.
          </p>
          <div className="flex justify-end pt-4">
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                handleClose(e)
              }}
              type="button"
            >
              Get Started
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

