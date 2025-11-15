import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Header } from './Header'

interface LayoutProps {
  children: React.ReactNode
}

const getPageTitle = (pathname: string): string => {
  if (pathname === '/') return 'Dashboard'
  if (pathname === '/timeline') return 'Timeline'
  if (pathname === '/resources') return 'Resources'
  if (pathname === '/resume') return 'Resume'
  if (pathname === '/forums') return 'Forums'
  if (pathname === '/explore-careers') return 'Explore Careers'
  if (pathname === '/preferences') return 'Preferences'
  if (pathname === '/admin') return 'Admin Dashboard'
  return 'Dashboard'
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  useEffect(() => {
    document.title = getPageTitle(location.pathname)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}

