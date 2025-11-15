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
    bg: 'bg-gradient-to-br from-lavender/20 to-lavender/40 dark:from-lavender/10 dark:to-lavender/20',
    border: 'border-primary/40 dark:border-primary/60',
    icon: 'text-primary dark:text-primary',
    gradient: 'from-primary to-lavender',
  },
  career: {
    bg: 'bg-gradient-to-br from-peach/30 to-peach/50 dark:from-peach/10 dark:to-peach/20',
    border: 'border-peach/50 dark:border-peach/60',
    icon: 'text-foreground dark:text-peach',
    gradient: 'from-peach to-soft-pink',
  },
  personal: {
    bg: 'bg-gradient-to-br from-soft-pink/30 to-soft-pink/50 dark:from-soft-pink/10 dark:to-soft-pink/20',
    border: 'border-soft-pink/50 dark:border-soft-pink/60',
    icon: 'text-foreground dark:text-soft-pink',
    gradient: 'from-soft-pink to-peach',
  },
  college: {
    bg: 'bg-gradient-to-br from-mint/30 to-mint/50 dark:from-mint/10 dark:to-mint/20',
    border: 'border-accent/50 dark:border-accent/60',
    icon: 'text-accent-foreground dark:text-accent',
    gradient: 'from-mint to-sky-blue',
  },
}

export function GoalsSection({ goals }: GoalsSectionProps) {
  return (
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary via-lavender to-accent bg-clip-text text-transparent">
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
              className={`${colors.bg} border-3 ${colors.border} rounded-3xl p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 transform hover:-translate-y-2 shadow-lg`}
              style={{ borderWidth: '3px' }}
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



