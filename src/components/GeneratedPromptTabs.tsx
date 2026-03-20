import { RadioTower, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { CopyButton } from '@/components/CopyButton'
import { PromptPreview } from '@/components/PromptPreview'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface GeneratedPromptTabsProps {
  compactPrompt: string
  fullPrompt: string
  hasBuilt: boolean
  onReset: () => void
}

export function GeneratedPromptTabs({
  compactPrompt,
  fullPrompt,
  hasBuilt,
  onReset,
}: GeneratedPromptTabsProps) {
  const [activeTab, setActiveTab] = useState<'full' | 'compact'>('full')

  const selectedPrompt = useMemo(
    () => (activeTab === 'full' ? fullPrompt : compactPrompt),
    [activeTab, compactPrompt, fullPrompt],
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <CardTitle>Generated prompts</CardTitle>
            <CardDescription>
              Drafts appear as you type. Build once to turn them into a live copy-ready result.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton disabled={!selectedPrompt || !hasBuilt} value={selectedPrompt} />
            <Button onClick={onReset} size="sm" type="button" variant="outline">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <Badge variant={hasBuilt ? 'success' : 'accent'}>
            {hasBuilt ? 'Live preview active' : 'Build to activate live sync'}
          </Badge>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            The right panel is designed for quick copy-paste once the structure feels right.
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          className="space-y-4"
          onValueChange={(value) => setActiveTab(value as 'full' | 'compact')}
          value={activeTab}
        >
          <TabsList>
            <TabsTrigger value="full">Full Prompt</TabsTrigger>
            <TabsTrigger value="compact">Compact Prompt</TabsTrigger>
          </TabsList>
          <TabsContent value="full">
            <PromptPreview
              content={fullPrompt}
              emptyDescription="Fill out the form, then build your prompt to see the full structured version here."
              emptyTitle="Your full prompt will appear here"
              hasBuilt={hasBuilt}
              previewName="Full prompt"
            />
          </TabsContent>
          <TabsContent value="compact">
            <PromptPreview
              content={compactPrompt}
              emptyDescription="PromptLab also creates a tighter version for faster copy-paste workflows."
              emptyTitle="Your compact prompt will appear here"
              hasBuilt={hasBuilt}
              previewName="Compact prompt"
            />
          </TabsContent>
        </Tabs>

        {hasBuilt ? (
          <div className="mt-4 flex items-start gap-3 rounded-[24px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
            <RadioTower className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <p className="leading-6">
              Live sync is on. Changes you make in the form will continue updating the prompt here.
            </p>
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3 rounded-[24px] border border-[color:var(--border)] bg-[color:var(--secondary)] px-4 py-3 text-sm text-[color:var(--secondary-foreground)]">
            <Sparkles className="mt-0.5 h-4.5 w-4.5 shrink-0" />
            <p className="leading-6">
              Use the final step to make last edits, then click build to turn this preview into a
              live, copy-ready prompt.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
