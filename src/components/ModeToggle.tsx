import { Gauge, WandSparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BuilderMode } from '@/types/prompt'

interface ModeToggleProps {
  mode: BuilderMode
  onChange: (nextMode: BuilderMode) => void
}

export function ModeToggle({ mode, onChange }: ModeToggleProps) {
  const options: Array<{
    value: BuilderMode
    label: string
    description: string
    icon: typeof WandSparkles
  }> = [
    {
      value: 'basic',
      label: 'Basic',
      description: 'Guided steps for non-technical users',
      icon: WandSparkles,
    },
    {
      value: 'advanced',
      label: 'Advanced',
      description: 'Compact control surface for power users',
      icon: Gauge,
    },
  ]

  return (
    <div className="inline-flex w-full flex-col gap-2 rounded-[28px] border border-white/70 bg-white/80 p-2 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:w-auto">
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const active = option.value === mode
          const Icon = option.icon

          return (
            <Button
              key={option.value}
              className={cn(
                'h-auto justify-start rounded-[22px] px-4 py-3',
                active &&
                  'bg-[linear-gradient(135deg,var(--primary),#2cb6a8)] text-white hover:brightness-105',
              )}
              onClick={() => onChange(option.value)}
              type="button"
              variant={active ? 'default' : 'ghost'}
            >
              <Icon className="mt-0.5 h-4.5 w-4.5 shrink-0" />
              <span className="text-left">
                <span className="block text-sm font-semibold">{option.label}</span>
                <span
                  className={cn(
                    'block text-xs leading-5',
                    active ? 'text-white/85' : 'text-[color:var(--muted-foreground)]',
                  )}
                >
                  {option.description}
                </span>
              </span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
