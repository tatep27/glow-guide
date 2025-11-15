import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { StudentList } from '@/components/admin/StudentList'
import { OpportunitiesManagement } from '@/components/admin/OpportunitiesManagement'
import { ForumsPage } from './ForumsPage'

type Tab = 'students' | 'opportunities' | 'forums'

export function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('students')

  // Debug: Log to verify component is rendering
  console.log('AdminDashboardPage rendering, activeTab:', activeTab)

  return (
    <div className="space-y-6" style={{ minHeight: '200px', padding: '20px' }}>
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#000' }}>School Counselor Dashboard</h1>
        <p className="text-muted-foreground" style={{ color: '#666' }}>Manage students and opportunities</p>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'students' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('students')}
            className="rounded-b-none"
          >
            Student Management
          </Button>
          <Button
            variant={activeTab === 'opportunities' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('opportunities')}
            className="rounded-b-none"
          >
            Opportunities Management
          </Button>
          <Button
            variant={activeTab === 'forums' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('forums')}
            className="rounded-b-none"
          >
            Forums
          </Button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: '20px' }}>
        {activeTab === 'students' && (
          <div>
            <StudentList />
          </div>
        )}
        {activeTab === 'opportunities' && (
          <div>
            <OpportunitiesManagement />
          </div>
        )}
        {activeTab === 'forums' && (
          <div>
            <ForumsPage />
          </div>
        )}
      </div>
    </div>
  )
}

