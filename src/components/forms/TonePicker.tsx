import { Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TonePickerProps {
  options: readonly string[]
  selected: string[]
  onToggle: (tone: string) => void
}

export function TonePicker({ onToggle, options, selected }: TonePickerProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((tone) => {
          const active = selected.includes(tone)

          return (
            <Button
              key={tone}
              className={cn(
                'rounded-full px-3.5',
                active &&
                  'bg-[linear-gradient(135deg,var(--accent),#fb923c)] text-white hover:brightness-105',
              )}
              onClick={() => onToggle(tone)}
              size="sm"
              type="button"
              variant={active ? 'default' : 'outline'}
            >
              <Sparkles className={cn('h-3.5 w-3.5', !active && 'text-[color:var(--accent)]')} />
              {tone}
            </Button>
          )
        })}
      </div>
      <p className="text-sm text-[color:var(--muted-foreground)]">
        Pick one or several tones. PromptLab will blend them into the final style instructions.
      </p>
    </div>
  )
}
