import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { TimelinePage } from './pages/TimelinePage'
import { ExploreCareersPage } from './pages/ExploreCareersPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ResumePage } from './pages/ResumePage'
import { ForumsPage } from './pages/ForumsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { PreferencesPage } from './pages/PreferencesPage'
import { OnboardingGuard } from './components/onboarding/OnboardingGuard'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { useViewMode } from './hooks/useViewMode'

function ViewGuard({ children, requiredView }: { children: React.ReactNode; requiredView: 'student' | 'admin' }) {
  const { viewMode } = useViewMode()

  // Debug logging
  console.log('ViewGuard:', { viewMode, requiredView, matches: viewMode === requiredView })

  if (viewMode !== requiredView) {
    console.log('ViewGuard redirecting:', requiredView === 'student' ? '/' : '/admin')
    return <Navigate to={requiredView === 'student' ? '/' : '/admin'} replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route
          path="/*"
          element={
            <OnboardingGuard>
              <Layout>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ViewGuard requiredView="student">
                        <DashboardPage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/timeline"
                    element={
                      <ViewGuard requiredView="student">
                        <TimelinePage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/explore-careers"
                    element={
                      <ViewGuard requiredView="student">
                        <ExploreCareersPage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/resources"
                    element={
                      <ViewGuard requiredView="student">
                        <ResourcesPage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/resume"
                    element={
                      <ViewGuard requiredView="student">
                        <ResumePage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/forums"
                    element={
                      <ViewGuard requiredView="student">
                        <ForumsPage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/preferences"
                    element={
                      <ViewGuard requiredView="student">
                        <PreferencesPage />
                      </ViewGuard>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ViewGuard requiredView="admin">
                        <AdminDashboardPage />
                      </ViewGuard>
                    }
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Layout>
            </OnboardingGuard>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
