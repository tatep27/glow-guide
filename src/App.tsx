import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { DashboardPage } from './pages/DashboardPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ResumePage } from './pages/ResumePage'
import { ForumsPage } from './pages/ForumsPage'
import { OnboardingPage } from './pages/OnboardingPage'
import { OnboardingGuard } from './components/onboarding/OnboardingGuard'

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
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/resources" element={<ResourcesPage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/forums" element={<ForumsPage />} />
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
