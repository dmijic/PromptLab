import { Award, Gauge } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { SCORE_MAX } from '@/lib/constants'
import type { PromptScoreResult } from '@/types/prompt'

interface PromptScoreCardProps {
  score: PromptScoreResult
}

const breakdownLabels: Array<[keyof PromptScoreResult['breakdown'], string, string]> = [
  ['goalClarity', 'Goal clarity', '/20'],
  ['contextCompleteness', 'Context completeness', '/15'],
  ['audienceDefinition', 'Audience definition', '/10'],
  ['taskSpecificity', 'Task specificity', '/20'],
  ['constraints', 'Constraints', '/10'],
  ['toneStyleDefinition', 'Tone/style', '/10'],
  ['outputFormatClarity', 'Output format', '/10'],
  ['inputMaterialRichness', 'Input material', '/5'],
]

export function PromptScoreCard({ score }: PromptScoreCardProps) {
  const badgeVariant =
    score.label === 'Excellent'
      ? 'success'
      : score.label === 'Strong'
        ? 'accent'
        : 'default'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Gauge className="h-4.5 w-4.5 text-[color:var(--primary)]" />
              <CardTitle>Prompt Quality Score</CardTitle>
            </div>
            <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
              A simple heuristic score based on clarity, structure, and response guidance.
            </p>
          </div>
          <Badge variant={badgeVariant}>{score.label}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-[26px] bg-[color:var(--secondary)] p-4">
          <div className="flex items-end gap-3">
            <span className="font-display text-5xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)]">
              {score.total}
            </span>
            <span className="pb-2 text-sm font-medium text-[color:var(--muted-foreground)]">
              / {SCORE_MAX}
            </span>
          </div>
          <Progress className="mt-4" value={score.total} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {breakdownLabels.map(([key, label, max]) => (
            <div
              key={key}
              className="flex items-center justify-between rounded-2xl border border-[color:var(--border)] bg-white/80 px-4 py-3"
            >
              <span className="text-sm text-[color:var(--muted-foreground)]">{label}</span>
              <span className="text-sm font-semibold text-[color:var(--foreground)]">
                {score.breakdown[key]}
                <span className="ml-1 text-[color:var(--muted-foreground)]">{max}</span>
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-dashed border-[color:var(--border-strong)] bg-white/60 px-4 py-3 text-sm text-[color:var(--muted-foreground)]">
          <Award className="mr-2 inline h-4 w-4 align-text-bottom text-[color:var(--accent)]" />
          Labels: 0-39 Weak, 40-59 Basic, 60-79 Strong, 80-100 Excellent.
        </div>
      </CardContent>
    </Card>
  )
}
