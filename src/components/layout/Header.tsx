import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useViewMode } from '@/hooks/useViewMode'

export function Header() {
  const { toggleViewMode, isStudentView } = useViewMode()

  const handleToggle = () => {
    toggleViewMode()
    // Force page reload to ensure clean state
    // After toggle, if we were in student view, go to admin; otherwise go to student
    if (isStudentView) {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  }

  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Demo Mode:</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-sm font-medium whitespace-nowrap ${isStudentView ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Student
                </span>
                <button
                  onClick={handleToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0 ${
                    isStudentView ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  role="switch"
                  aria-checked={!isStudentView}
                  aria-label="Toggle between student and admin view"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isStudentView ? 'translate-x-1' : 'translate-x-6'
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium whitespace-nowrap ${!isStudentView ? 'text-foreground' : 'text-muted-foreground'}`}>
                  Admin
                </span>
              </div>
            </div>
          </div>
          {isStudentView && (
            <nav className="flex gap-4">
              <Link to="/">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link to="/timeline">
                <Button variant="ghost">Timeline</Button>
              </Link>
              <Link to="/resources">
                <Button variant="ghost">Resources</Button>
              </Link>
              <Link to="/resume">
                <Button variant="ghost">Resume</Button>
              </Link>
              <Link to="/forums">
                <Button variant="ghost">Forums</Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

