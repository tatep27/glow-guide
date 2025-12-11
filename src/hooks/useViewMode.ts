import { useLocalStorage } from './useLocalStorage'

export type ViewMode = 'student' | 'admin'

export function useViewMode() {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('view-mode', 'student')

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'student' ? 'admin' : 'student'))
  }

  return {
    viewMode,
    setViewMode,
    toggleViewMode,
    isStudentView: viewMode === 'student',
    isAdminView: viewMode === 'admin',
  }
}




