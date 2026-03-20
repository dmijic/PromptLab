import type { EfficiencyMetrics, PromptScoreResult, PromptSuggestion } from '@/types/prompt'

import { EfficiencyDashboard } from '@/components/EfficiencyDashboard'
import { GeneratedPromptTabs } from '@/components/GeneratedPromptTabs'
import { PromptScoreCard } from '@/components/PromptScoreCard'
import { SuggestionsList } from '@/components/SuggestionsList'

interface ResultsPanelProps {
  compactPrompt: string
  fullPrompt: string
  hasBuilt: boolean
  metrics: EfficiencyMetrics
  onReset: () => void
  score: PromptScoreResult
  suggestions: PromptSuggestion[]
}

export function ResultsPanel({
  compactPrompt,
  fullPrompt,
  hasBuilt,
  metrics,
  onReset,
  score,
  suggestions,
}: ResultsPanelProps) {
  return (
    <div className="space-y-6 xl:sticky xl:top-6">
      <GeneratedPromptTabs
        compactPrompt={compactPrompt}
        fullPrompt={fullPrompt}
        hasBuilt={hasBuilt}
        onReset={onReset}
      />
      <PromptScoreCard score={score} />
      <EfficiencyDashboard metrics={metrics} />
      <SuggestionsList suggestions={suggestions} />
    </div>
  )
}
