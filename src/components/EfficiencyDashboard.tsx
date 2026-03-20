import { BotMessageSquare, LayoutTemplate, RefreshCcwDot, ScanSearch } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { EfficiencyMetrics } from '@/types/prompt'

interface EfficiencyDashboardProps {
  metrics: EfficiencyMetrics
}

const items = [
  {
    key: 'structureImprovement',
    label: 'Structure improvement',
    icon: LayoutTemplate,
  },
  {
    key: 'estimatedRetryReduction',
    label: 'Estimated retry reduction',
    icon: RefreshCcwDot,
  },
  {
    key: 'estimatedTokenEfficiencyGain',
    label: 'Estimated token efficiency gain',
    icon: BotMessageSquare,
  },
  {
    key: 'completeness',
    label: 'Completeness',
    icon: ScanSearch,
  },
] as const

function getSignalLabel(value: number) {
  if (value >= 75) {
    return 'Strong signal'
  }

  if (value >= 50) {
    return 'Solid signal'
  }

  return 'Early signal'
}

export function EfficiencyDashboard({ metrics }: EfficiencyDashboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Efficiency Insights</CardTitle>
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
          Heuristic signals for how much structure your current brief is adding so far.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map(({ icon: Icon, key, label }) => (
            <div
              key={key}
              className="rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(245,248,250,0.94))] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--secondary)] text-[color:var(--primary)]">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <p className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                  {getSignalLabel(metrics[key])}
                </p>
              </div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                {label}
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
                {metrics[key]}%
              </p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[color:var(--secondary)]">
                <div
                  className={cn(
                    'h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--accent))] transition-[width] duration-500',
                    metrics[key] >= 75 && 'shadow-[0_0_18px_rgba(20,122,123,0.22)]',
                  )}
                  style={{ width: `${metrics[key]}%` }}
                />
              </div>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted-foreground)]">
                {label === 'Completeness'
                  ? 'How much of the prompt brief has been filled in.'
                  : 'A directional estimate, not a measured system metric.'}
              </p>
            </div>
          ))}
        </div>

        <p className="rounded-2xl border border-dashed border-[color:var(--border-strong)] bg-white/60 px-4 py-3 text-sm leading-6 text-[color:var(--muted-foreground)]">
          These are heuristic estimates designed to show likely improvement in prompt clarity and
          iteration efficiency.
        </p>
      </CardContent>
    </Card>
  )
}
