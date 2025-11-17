import { useLocalStorage } from './useLocalStorage'
import { experiences as defaultExperiences } from '@/data/experiences'
import type { Experience } from '@/types'

export function useExperiences() {
  const [experiences, setExperiences] = useLocalStorage<Experience[]>(
    'user-experiences',
    defaultExperiences
  )

  const addExperience = (experience: Omit<Experience, 'id'>) => {
    const newExperience: Experience = {
      ...experience,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setExperiences((prev) => [...prev, newExperience])
    return newExperience
  }

  const updateExperience = (id: string, updates: Partial<Experience>) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    )
  }

  const deleteExperience = (id: string) => {
    setExperiences((prev) => prev.filter((exp) => exp.id !== id))
  }

  return {
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
  }
}

