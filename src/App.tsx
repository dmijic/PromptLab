import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch, type Resolver } from 'react-hook-form'

import { AdvancedForm } from '@/components/AdvancedForm'
import { AppLayout } from '@/components/AppLayout'
import { BasicWizard } from '@/components/BasicWizard'
import { Header } from '@/components/Header'
import { ModeToggle } from '@/components/ModeToggle'
import { ResultsPanel } from '@/components/ResultsPanel'
import { TooltipProvider } from '@/components/ui/tooltip'
import {
  buildCompactPrompt,
  buildFullPrompt,
  buildSuggestions,
  calculateEfficiencyMetrics,
  calculatePromptScore,
} from '@/lib/prompt-engine'
import { defaultPromptValues, promptFormSchema } from '@/lib/schema'
import type { BuilderMode, PromptFormData } from '@/types/prompt'

function App() {
  const [mode, setMode] = useState<BuilderMode>('basic')
  const [hasBuilt, setHasBuilt] = useState(false)

  const form = useForm<PromptFormData, undefined, PromptFormData>({
    resolver: zodResolver(promptFormSchema) as Resolver<
      PromptFormData,
      undefined,
      PromptFormData
    >,
    defaultValues: defaultPromptValues,
    mode: 'onChange',
  })

  const watchedValues = useWatch({ control: form.control }) as PromptFormData
  const deferredValues = useDeferredValue(watchedValues)

  const score = useMemo(() => calculatePromptScore(deferredValues), [deferredValues])
  const metrics = useMemo(
    () => calculateEfficiencyMetrics(deferredValues),
    [deferredValues],
  )
  const suggestions = useMemo(() => buildSuggestions(deferredValues), [deferredValues])
  const canPreviewPrompt = deferredValues.objective.trim().length > 0

  const fullPrompt = useMemo(
    () => (canPreviewPrompt ? buildFullPrompt(deferredValues) : ''),
    [canPreviewPrompt, deferredValues],
  )

  const compactPrompt = useMemo(
    () => (canPreviewPrompt ? buildCompactPrompt(deferredValues) : ''),
    [canPreviewPrompt, deferredValues],
  )

  const handleBuild = form.handleSubmit(() => {
    startTransition(() => setHasBuilt(true))
  })

  const handleReset = () => {
    form.reset(defaultPromptValues)
    startTransition(() => {
      setHasBuilt(false)
    })
  }

  return (
    <TooltipProvider delayDuration={120}>
      <AppLayout
        header={
          <div className="space-y-4">
            <Header />
            <ModeToggle
              mode={mode}
              onChange={(nextMode) => startTransition(() => setMode(nextMode))}
            />
          </div>
        }
        left={
          mode === 'basic' ? (
            <BasicWizard form={form} hasBuilt={hasBuilt} onBuild={handleBuild} />
          ) : (
            <AdvancedForm form={form} hasBuilt={hasBuilt} onBuild={handleBuild} />
          )
        }
        right={
          <ResultsPanel
            compactPrompt={compactPrompt}
            fullPrompt={fullPrompt}
            hasBuilt={hasBuilt}
            metrics={metrics}
            onReset={handleReset}
            score={score}
            suggestions={suggestions}
          />
        }
      />
    </TooltipProvider>
  )
}

export default App
