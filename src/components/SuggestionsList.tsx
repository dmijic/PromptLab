import { Lightbulb, PartyPopper } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PromptSuggestion } from '@/types/prompt'

interface SuggestionsListProps {
  suggestions: PromptSuggestion[]
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggestions</CardTitle>
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">
          Friendly nudges when useful information is missing or under-specified.
        </p>
      </CardHeader>
      <CardContent>
        {suggestions.length === 0 ? (
          <div className="rounded-[24px] border border-dashed border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,252,0.94))] px-5 py-6">
            <PartyPopper className="mb-3 h-5 w-5 text-[color:var(--accent)]" />
            <p className="text-sm font-semibold text-[color:var(--foreground)]">
              This prompt brief already looks well-rounded.
            </p>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
              You have enough signal for a strong first draft. Fine-tune only if the output needs a
              more specific voice or tighter constraints.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="rounded-[24px] border border-[color:var(--border)] bg-white/75 px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-2xl bg-[color:var(--secondary)] text-[color:var(--accent)]">
                    <Lightbulb className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[color:var(--foreground)]">
                      {suggestion.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                      {suggestion.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
