import { type ReactNode, useMemo, useState } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers3,
  Palette,
  PartyPopper,
  RadioTower,
  Shapes,
  WandSparkles,
} from 'lucide-react'

import { FieldHint } from '@/components/forms/FieldHint'
import { FieldMessage } from '@/components/forms/FieldMessage'
import { TonePicker } from '@/components/forms/TonePicker'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  AUDIENCE_OPTIONS,
  DETAIL_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  OUTPUT_FORMAT_OPTIONS,
  PROMPT_TYPE_OPTIONS,
  TONE_OPTIONS,
} from '@/lib/constants'
import { getDefaultRole, resolveAudienceValue, resolveLanguageValue } from '@/lib/prompt-engine'
import { cn } from '@/lib/utils'
import type { PromptFormData } from '@/types/prompt'

interface BasicWizardProps {
  form: UseFormReturn<PromptFormData, undefined, PromptFormData>
  hasBuilt: boolean
  onBuild: () => void
}

const steps = [
  {
    title: 'What should PromptLab help you make?',
    shortLabel: 'Goal',
    description: 'Start with the outcome you want. Plain language is perfect here.',
    example:
      'Example: “Write a short customer update about a delayed shipment that still feels calm and reassuring.”',
    icon: WandSparkles,
    status: 'Turning your idea into a clear ask',
  },
  {
    title: 'Give it the helpful background',
    shortLabel: 'Details',
    description: 'Add the context, notes, or audience details that make the answer more useful.',
    example:
      'Example: mention the situation, paste rough notes, and say who will read the final answer.',
    icon: Layers3,
    status: 'Adding the details that reduce rewrites',
  },
  {
    title: 'Choose how it should sound',
    shortLabel: 'Style',
    description: 'Tell PromptLab what voice, language, and level of depth feel right.',
    example: 'Example: friendly, concise, in English, with balanced detail.',
    icon: Palette,
    status: 'Shaping the tone and reading experience',
  },
  {
    title: 'Decide what the answer should look like',
    shortLabel: 'Output',
    description: 'Pick the format, length, and anything the answer should include or avoid.',
    example: 'Example: bullet list, under 200 words, include next steps, avoid jargon.',
    icon: Shapes,
    status: 'Adding useful guardrails before the final build',
  },
  {
    title: 'Make final tweaks and build',
    shortLabel: 'Review',
    description: 'You can still edit everything here without hopping back through earlier steps.',
    example: 'Example: tighten the goal, tweak the tone, then build once to keep the preview live.',
    icon: PartyPopper,
    status: 'Final tune-up before live preview',
  },
] as const

const stepFields: Array<Array<keyof PromptFormData>> = [
  ['promptType', 'objective'],
  ['context', 'inputMaterial', 'audience', 'audienceCustom'],
  ['tones', 'language', 'languageCustom', 'detailLevel'],
  ['outputFormat', 'maxLength', 'mustInclude', 'mustAvoid'],
  [],
]

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-[color:var(--border)] bg-white/82 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
        {value || 'Not added yet'}
      </p>
    </div>
  )
}

function ReviewEditorCard({
  children,
  description,
  title,
}: {
  children: ReactNode
  description: string
  title: string
}) {
  return (
    <div className="rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(247,250,252,0.9))] p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)]">
      <div className="mb-4 space-y-1">
        <h4 className="text-base font-semibold text-[color:var(--foreground)]">{title}</h4>
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

export function BasicWizard({ form, hasBuilt, onBuild }: BasicWizardProps) {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')

  const values = useWatch({ control: form.control }) as PromptFormData
  const audience = resolveAudienceValue(values)
  const language = resolveLanguageValue(values)
  const resolvedRole = getDefaultRole(values.promptType)
  const progressValue = ((step + 1) / steps.length) * 100
  const currentStep = steps[step]

  const promptTypeDescription = useMemo(
    () => PROMPT_TYPE_OPTIONS.find((option) => option.value === values.promptType)?.description,
    [values.promptType],
  )

  const toggleTone = (tone: string) => {
    const current = values.tones
    const next = current.includes(tone)
      ? current.filter((item) => item !== tone)
      : [...current, tone]

    form.setValue('tones', next, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const setDetailLevel = (value: PromptFormData['detailLevel']) => {
    form.setValue('detailLevel', value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
  }

  const goToStep = (nextStep: number) => {
    setDirection(nextStep > step ? 'forward' : 'backward')
    setStep(nextStep)
  }

  const goToNextStep = async () => {
    const isValid = await form.trigger(stepFields[step])

    if (!isValid) {
      return
    }

    setDirection('forward')
    setStep((current) => Math.min(current + 1, steps.length - 1))
  }

  const goToPreviousStep = () => {
    setDirection('backward')
    setStep((current) => Math.max(current - 1, 0))
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.9))]">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge className="w-fit" variant="accent">
                Basic Mode
              </Badge>
              <div className="space-y-2">
                <CardTitle className="max-w-2xl font-display text-[2rem] leading-tight tracking-[-0.03em]">
                  {currentStep.title}
                </CardTitle>
                <p className="max-w-2xl text-[15px] leading-7 text-[color:var(--muted-foreground)]">
                  {currentStep.description}
                </p>
                <p className="max-w-2xl text-sm font-medium leading-6 text-[color:var(--accent-foreground)]">
                  {currentStep.example}
                </p>
              </div>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-[linear-gradient(135deg,var(--secondary),white)] text-[color:var(--primary)] shadow-[0_14px_32px_rgba(20,122,123,0.12)]">
              <currentStep.icon className="h-7 w-7" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                  Prompt building path
                </p>
                <p className="text-sm leading-6 text-[color:var(--secondary-foreground)]">
                  {currentStep.status}
                </p>
              </div>
              <div className="rounded-full bg-[color:var(--secondary)] px-3 py-1.5 text-sm font-semibold text-[color:var(--secondary-foreground)]">
                Step {step + 1} of {steps.length}
              </div>
            </div>

            <div className="mt-4 overflow-x-auto pb-1">
              <div className="flex min-w-max items-center gap-2">
                {steps.map((item, index) => (
                  <button
                    key={item.title}
                    className={cn(
                      'flex items-center gap-3 rounded-full border px-3 py-2 text-left transition-all',
                      index === step
                        ? 'border-transparent bg-[linear-gradient(135deg,var(--primary),#2cb6a8)] text-white shadow-[0_12px_26px_rgba(20,122,123,0.24)]'
                        : index < step
                          ? 'border-transparent bg-[color:var(--accent-soft)] text-[color:var(--accent-foreground)]'
                          : 'border-[color:var(--border)] bg-white text-[color:var(--muted-foreground)] hover:bg-white/95',
                    )}
                    onClick={() => goToStep(index)}
                    type="button"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold',
                        index === step
                          ? 'bg-white/18 text-white'
                          : index < step
                            ? 'bg-white/70 text-[color:var(--accent-foreground)]'
                            : 'bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]',
                      )}
                    >
                      {index < step ? <Check className="h-4 w-4" /> : index + 1}
                    </span>
                    <span>
                      <span className="block text-xs font-semibold uppercase tracking-[0.14em]">
                        {item.shortLabel}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between text-sm text-[color:var(--muted-foreground)]">
                <span>{Math.round(progressValue)}% complete</span>
                <span>{currentStep.status}</span>
              </div>
              <div className="relative">
                <Progress className="h-3.5 bg-white" value={progressValue} />
                <span
                  className="pointer-events-none absolute top-1/2 h-6 w-6 -translate-y-1/2 rounded-full border-[3px] border-white bg-[linear-gradient(135deg,var(--accent),#f4a261)] shadow-[0_12px_24px_rgba(239,123,69,0.28)]"
                  style={{
                    left: `clamp(0px, calc(${progressValue}% - 12px), calc(100% - 24px))`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 sm:p-7">
        <div
          className={cn(
            'space-y-6',
            direction === 'forward'
              ? 'motion-safe:animate-[step-in-forward_320ms_cubic-bezier(0.16,1,0.3,1)]'
              : 'motion-safe:animate-[step-in-backward_320ms_cubic-bezier(0.16,1,0.3,1)]',
          )}
          key={step}
        >
          {step === 0 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="basic-promptType">What kind of help do you need?</Label>
                <Select
                  id="basic-promptType"
                  {...form.register('promptType')}
                  aria-invalid={Boolean(form.formState.errors.promptType)}
                >
                  {PROMPT_TYPE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FieldHint
                  example='Try the closest match. If you are drafting a message to someone, "Email" is usually the right fit.'
                  helper={promptTypeDescription}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-objective">What would a good result look like?</Label>
                <Textarea
                  id="basic-objective"
                  placeholder="Describe the finished thing you want back."
                  {...form.register('objective')}
                  aria-invalid={Boolean(form.formState.errors.objective)}
                />
                <FieldHint
                  example='Try: "Summarize these meeting notes into a short update my team can read in under a minute."'
                  helper="Describe the outcome, not just the topic. The clearer this is, the better the first draft usually is."
                />
                <FieldMessage message={form.formState.errors.objective?.message} />
              </div>
            </>
          ) : null}

          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="basic-context">Anything it should know first?</Label>
                <Textarea
                  id="basic-context"
                  placeholder="Share the situation, background, or anything that changes the answer."
                  {...form.register('context')}
                />
                <FieldHint
                  example='Try: "This is for a launch update after we delayed by one week because of QA fixes."'
                  helper="A little background often saves a full rewrite later."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-inputMaterial">Do you already have notes or source text?</Label>
                <Textarea
                  id="basic-inputMaterial"
                  placeholder="Paste notes, bullets, requirements, facts, or rough text here."
                  {...form.register('inputMaterial')}
                />
                <FieldHint
                  example="Try pasting a rough draft, meeting notes, product facts, or bullet points."
                  helper="Optional, but helpful when you want the output to stay close to your own material."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-audience">Who is this for?</Label>
                <Select id="basic-audience" {...form.register('audience')}>
                  {AUDIENCE_OPTIONS.map((option) => (
                    <option key={option.value || 'blank'} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
                <FieldHint
                  example='Try: "busy executives", "new customers", or "students learning the basics".'
                  helper="Naming the reader helps the wording and tone feel more intentional."
                />
                {values.audience === 'custom' ? (
                  <div className="space-y-2">
                    <Input
                      id="basic-audienceCustom"
                      placeholder="Describe your audience"
                      {...form.register('audienceCustom')}
                    />
                    <FieldMessage message={form.formState.errors.audienceCustom?.message} />
                  </div>
                ) : null}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="space-y-2">
                <Label>How should it feel?</Label>
                <TonePicker
                  onToggle={toggleTone}
                  options={TONE_OPTIONS}
                  selected={values.tones}
                />
                <FieldHint
                  example='Try a mix like "Friendly" + "Concise" when you want something warm but efficient.'
                  helper="You can pick one tone or blend a few."
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basic-language">Which language should it use?</Label>
                  <Select id="basic-language" {...form.register('language')}>
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FieldHint
                    example='Choose Custom if you want something like "Portuguese" or "Serbian Latin".'
                    helper="Use the language you want the final answer to come back in."
                  />
                  {values.language === 'custom' ? (
                    <>
                      <Input
                        id="basic-languageCustom"
                        placeholder="Add your preferred language"
                        {...form.register('languageCustom')}
                      />
                      <FieldMessage message={form.formState.errors.languageCustom?.message} />
                    </>
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label>How much detail do you want?</Label>
                  <div className="grid gap-2">
                    {DETAIL_LEVEL_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        className={cn(
                          'rounded-[22px] border px-4 py-3 text-left transition',
                          values.detailLevel === option.value
                            ? 'border-transparent bg-[linear-gradient(135deg,var(--secondary),rgba(255,255,255,0.95))] shadow-[0_12px_28px_rgba(15,23,42,0.06)]'
                            : 'border-[color:var(--border)] bg-white/80 hover:bg-white',
                        )}
                        onClick={() => setDetailLevel(option.value)}
                        type="button"
                      >
                        <p className="text-sm font-semibold text-[color:var(--foreground)]">
                          {option.label}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                  <FieldHint
                    example='If you just need something fast to paste elsewhere, "Short" is often enough.'
                    helper="Pick the level of explanation you want back."
                  />
                </div>
              </div>
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="basic-outputFormat">How should the answer come back?</Label>
                  <Select id="basic-outputFormat" {...form.register('outputFormat')}>
                    {OUTPUT_FORMAT_OPTIONS.map((option) => (
                      <option key={option.value || 'blank'} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                  <FieldHint
                    example='Try "bullet list", "email draft", or "step-by-step plan".'
                    helper="A clear format usually makes the result easier to reuse right away."
                  />
                  <FieldMessage
                    message={
                      !values.outputFormat
                        ? 'Choosing a format is strongly encouraged because it usually improves consistency.'
                        : undefined
                    }
                    tone="warning"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basic-maxLength">How long should it be?</Label>
                  <Input
                    id="basic-maxLength"
                    placeholder="e.g. under 200 words or 5 bullets"
                    {...form.register('maxLength')}
                  />
                  <FieldHint
                    example='Try: "under 150 words", "5 bullets max", or "2 short paragraphs".'
                    helper="Optional, but great when you want something quick to skim."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-mustInclude">What absolutely needs to be in there?</Label>
                <Textarea
                  id="basic-mustInclude"
                  placeholder="List the points, facts, or sections that should definitely appear."
                  {...form.register('mustInclude')}
                />
                <FieldHint
                  example='Try: "mention the new timeline, thank customers for patience, include the support link".'
                  helper="This is useful for making sure the answer does not miss important details."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="basic-mustAvoid">What should it stay away from?</Label>
                <Textarea
                  id="basic-mustAvoid"
                  placeholder="Call out wording, claims, or patterns you do not want."
                  {...form.register('mustAvoid')}
                />
                <FieldHint
                  example='Try: "avoid jargon", "do not sound defensive", or "skip unsupported claims".'
                  helper="Great for steering away from fluff, hype, or risky phrasing."
                />
              </div>
            </>
          ) : null}

          {step === 4 ? (
            <div className="space-y-6">
              <div className="rounded-[28px] border border-[color:var(--border)] bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,248,242,0.92))] px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-[color:var(--foreground)]">
                      Final tune-up
                    </h3>
                    <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)]">
                      You can edit anything here without jumping back through the earlier steps.
                      Once you build, the prompt preview on the right stays live while you keep
                      making changes.
                    </p>
                  </div>
                  <div className="rounded-full bg-[color:var(--secondary)] px-3 py-1.5 text-sm font-semibold text-[color:var(--secondary-foreground)]">
                    {hasBuilt ? 'Live preview enabled' : 'Ready to build'}
                  </div>
                </div>

                {hasBuilt ? (
                  <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-sm text-emerald-800">
                    <RadioTower className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                    <p className="leading-6">
                      Live sync is on. Edit any field below and the prompt preview will keep up.
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <SummaryRow
                  label="Prompt type"
                  value={
                    PROMPT_TYPE_OPTIONS.find((option) => option.value === values.promptType)?.label ||
                    ''
                  }
                />
                <SummaryRow label="Default role" value={resolvedRole} />
                <SummaryRow label="Audience" value={audience} />
                <SummaryRow label="Language" value={language} />
                <SummaryRow label="Tone" value={values.tones.join(', ')} />
                <SummaryRow label="Output format" value={values.outputFormat} />
              </div>

              <div className="grid gap-4 xl:grid-cols-2">
                <ReviewEditorCard
                  description="Make sure the main ask feels clear and grounded."
                  title="What you want back"
                >
                  <div className="space-y-2">
                    <Label htmlFor="review-promptType">Prompt type</Label>
                    <Select id="review-promptType" {...form.register('promptType')}>
                      {PROMPT_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-objective">Objective</Label>
                    <Textarea
                      id="review-objective"
                      className="min-h-[120px]"
                      placeholder="Describe the finished thing you want back."
                      {...form.register('objective')}
                    />
                    <FieldMessage message={form.formState.errors.objective?.message} />
                  </div>
                </ReviewEditorCard>

                <ReviewEditorCard
                  description="Add enough context for a better first draft, without overloading it."
                  title="Background and audience"
                >
                  <div className="space-y-2">
                    <Label htmlFor="review-audience">Audience</Label>
                    <Select id="review-audience" {...form.register('audience')}>
                      {AUDIENCE_OPTIONS.map((option) => (
                        <option key={option.value || 'blank'} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    {values.audience === 'custom' ? (
                      <>
                        <Input
                          id="review-audienceCustom"
                          placeholder="Describe your audience"
                          {...form.register('audienceCustom')}
                        />
                        <FieldMessage message={form.formState.errors.audienceCustom?.message} />
                      </>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-context">Context</Label>
                    <Textarea
                      id="review-context"
                      className="min-h-[110px]"
                      placeholder="Share the situation or background."
                      {...form.register('context')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-inputMaterial">Input material</Label>
                    <Textarea
                      id="review-inputMaterial"
                      className="min-h-[110px]"
                      placeholder="Paste notes, bullets, or source text."
                      {...form.register('inputMaterial')}
                    />
                  </div>
                </ReviewEditorCard>

                <ReviewEditorCard
                  description="Fine-tune how the answer should sound and what shape it should take."
                  title="Voice and format"
                >
                  <div className="space-y-2">
                    <Label>Tones</Label>
                    <TonePicker
                      onToggle={toggleTone}
                      options={TONE_OPTIONS}
                      selected={values.tones}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="review-language">Language</Label>
                      <Select id="review-language" {...form.register('language')}>
                        {LANGUAGE_OPTIONS.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                      {values.language === 'custom' ? (
                        <>
                          <Input
                            id="review-languageCustom"
                            placeholder="Add your preferred language"
                            {...form.register('languageCustom')}
                          />
                          <FieldMessage message={form.formState.errors.languageCustom?.message} />
                        </>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="review-outputFormat">Output format</Label>
                      <Select id="review-outputFormat" {...form.register('outputFormat')}>
                        {OUTPUT_FORMAT_OPTIONS.map((option) => (
                          <option key={option.value || 'blank'} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Detail level</Label>
                    <div className="grid gap-2 sm:grid-cols-3">
                      {DETAIL_LEVEL_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          className={cn(
                            'rounded-[20px] border px-4 py-3 text-left transition',
                            values.detailLevel === option.value
                              ? 'border-transparent bg-[color:var(--secondary)]'
                              : 'border-[color:var(--border)] bg-white/80',
                          )}
                          onClick={() => setDetailLevel(option.value)}
                          type="button"
                        >
                          <p className="text-sm font-semibold text-[color:var(--foreground)]">
                            {option.label}
                          </p>
                          <p className="mt-1 text-xs leading-5 text-[color:var(--muted-foreground)]">
                            {option.description}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-maxLength">Max length</Label>
                    <Input
                      id="review-maxLength"
                      placeholder="e.g. under 200 words"
                      {...form.register('maxLength')}
                    />
                  </div>
                </ReviewEditorCard>

                <ReviewEditorCard
                  description="Use these fields to prevent missing details or unwanted wording."
                  title="Final guardrails"
                >
                  <div className="space-y-2">
                    <Label htmlFor="review-mustInclude">Must include</Label>
                    <Textarea
                      id="review-mustInclude"
                      className="min-h-[120px]"
                      placeholder="Anything the answer should definitely include."
                      {...form.register('mustInclude')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="review-mustAvoid">Must avoid</Label>
                    <Textarea
                      id="review-mustAvoid"
                      className="min-h-[120px]"
                      placeholder="Anything the answer should stay away from."
                      {...form.register('mustAvoid')}
                    />
                  </div>
                </ReviewEditorCard>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3 border-t border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(248,250,252,0.7),rgba(255,255,255,0.88))]">
        <Button onClick={goToPreviousStep} type="button" variant="ghost">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {step < steps.length - 1 ? (
          <Button onClick={goToNextStep} type="button">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex flex-wrap items-center justify-end gap-3">
            {hasBuilt ? (
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-800">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Live preview on
              </div>
            ) : null}
            <Button onClick={onBuild} type="button">
              <FileText className="h-4 w-4" />
              {hasBuilt ? 'Refresh preview' : 'Build my prompt'}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
