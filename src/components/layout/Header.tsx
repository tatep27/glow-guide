import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Career Readiness Platform
          </Link>
          <nav className="flex gap-4">
            <Link to="/">
              <Button variant="ghost">Dashboard</Button>
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
        </div>
      </div>
    </header>
  )
}

