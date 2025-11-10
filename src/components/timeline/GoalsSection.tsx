import type { Goal } from '@/types'
import { Target, GraduationCap, BookOpen, Heart } from 'lucide-react'
import { format } from 'date-fns'

interface GoalsSectionProps {
  goals: Goal[]
}

const goalIcons: Record<Goal['category'], typeof Target> = {
  academic: BookOpen,
  career: Target,
  personal: Heart,
  college: GraduationCap,
}

const goalColors: Record<Goal['category'], { bg: string; border: string; icon: string; gradient: string }> = {
  academic: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/50 dark:to-indigo-900/50',
    border: 'border-indigo-300 dark:border-indigo-700',
    icon: 'text-indigo-600 dark:text-indigo-400',
    gradient: 'from-indigo-500 to-purple-500',
  },
  career: {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/50',
    border: 'border-amber-300 dark:border-amber-700',
    icon: 'text-amber-600 dark:text-amber-400',
    gradient: 'from-amber-500 to-orange-500',
  },
  personal: {
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/50 dark:to-pink-900/50',
    border: 'border-pink-300 dark:border-pink-700',
    icon: 'text-pink-600 dark:text-pink-400',
    gradient: 'from-pink-500 to-rose-500',
  },
  college: {
    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/50',
    border: 'border-emerald-300 dark:border-emerald-700',
    icon: 'text-emerald-600 dark:text-emerald-400',
    gradient: 'from-emerald-500 to-teal-500',
  },
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Your Goals
        </h2>
        <p className="text-muted-foreground text-lg">
          Where you're headed and what you're working towards
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const Icon = goalIcons[goal.category]
          const colors = goalColors[goal.category]

          return (
            <div
              key={goal.id}
              className={`${colors.bg} border-2 ${colors.border} rounded-xl p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className={`${colors.icon} flex-shrink-0`}>
                    {goal.icon ? (
                      <span className="text-3xl">{goal.icon}</span>
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-foreground mb-1">{goal.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{goal.description}</p>
                  </div>
                </div>
                {goal.targetDate && (
                  <div className="pt-2 border-t border-current/20">
                    <p className="text-xs font-medium text-muted-foreground">
                      Target: {format(new Date(goal.targetDate), 'MMM yyyy')}
                    </p>
                  </div>
                )}
                {!goal.targetDate && (
                  <div className="pt-2 border-t border-current/20">
                    <p className="text-xs font-medium text-muted-foreground">Ongoing goal</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


