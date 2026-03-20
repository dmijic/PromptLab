import type { UseFormReturn } from 'react-hook-form'
import { useWatch } from 'react-hook-form'
import { BrainCircuit, FileOutput, RadioTower, ShieldCheck, Sparkles, TextSearch } from 'lucide-react'

import { SectionCard } from '@/components/SectionCard'
import { TooltipLabel } from '@/components/TooltipLabel'
import { FieldMessage } from '@/components/forms/FieldMessage'
import { TonePicker } from '@/components/forms/TonePicker'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ADVANCED_FIELD_TOOLTIPS,
  AUDIENCE_OPTIONS,
  DETAIL_LEVEL_OPTIONS,
  LANGUAGE_OPTIONS,
  OUTPUT_FORMAT_OPTIONS,
  PROMPT_TYPE_OPTIONS,
  TONE_OPTIONS,
} from '@/lib/constants'
import { getDefaultRole } from '@/lib/prompt-engine'
import type { PromptFormData } from '@/types/prompt'

interface AdvancedFormProps {
  form: UseFormReturn<PromptFormData, undefined, PromptFormData>
  hasBuilt: boolean
  onBuild: () => void
}

export function AdvancedForm({ form, hasBuilt, onBuild }: AdvancedFormProps) {
  const values = useWatch({ control: form.control }) as PromptFormData

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

  return (
    <div className="space-y-6">
      <SectionCard
        action={
          <Button onClick={onBuild} type="button">
            <Sparkles className="h-4 w-4" />
            {hasBuilt ? 'Refresh live preview' : 'Build prompt'}
          </Button>
        }
        description="A denser control surface for people who already know what good prompt inputs look like."
        icon={BrainCircuit}
        title="Advanced Mode"
      >
        <div className="space-y-5">
          <div className="flex items-start gap-3 rounded-[24px] border border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(247,250,252,0.9))] px-4 py-4 text-sm text-[color:var(--muted-foreground)]">
            <RadioTower className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[color:var(--primary)]" />
            <p className="leading-6">
              {hasBuilt
                ? 'Live sync is on. Keep editing and the prompt preview on the right will keep updating.'
                : 'Build once whenever you are ready. After that, the prompt preview stays in sync while you edit.'}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-promptType"
              helper="This sets the starting role and a sensible default task instruction."
              label="Prompt type"
              tooltip={ADVANCED_FIELD_TOOLTIPS.promptType}
            />
            <Select id="advanced-promptType" {...form.register('promptType')}>
              {PROMPT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-role"
              helper="Leave blank unless you want to override PromptLab’s default expert role."
              label="Role"
              tooltip={ADVANCED_FIELD_TOOLTIPS.role}
            />
            <Input
              id="advanced-role"
              placeholder={getDefaultRole(values.promptType)}
              {...form.register('role')}
            />
          </div>
        </div>
        </div>
      </SectionCard>

      <SectionCard
        contentClassName="space-y-6"
        description="Set the actual ask first, then add only the background that changes the answer."
        icon={TextSearch}
        title="Foundations"
      >
        <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-objective"
              helper="Write the result you want back in plain language."
              label="Objective"
              required
              tooltip={ADVANCED_FIELD_TOOLTIPS.objective}
          />
          <Textarea
            id="advanced-objective"
            placeholder="Describe the exact outcome you want."
            {...form.register('objective')}
            aria-invalid={Boolean(form.formState.errors.objective)}
          />
          <FieldMessage message={form.formState.errors.objective?.message} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-audience"
              helper="Useful when the same topic needs a different tone for a different reader."
              label="Audience"
              tooltip={ADVANCED_FIELD_TOOLTIPS.audience}
            />
            <Select id="advanced-audience" {...form.register('audience')}>
              {AUDIENCE_OPTIONS.map((option) => (
                <option key={option.value || 'blank'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {values.audience === 'custom' ? (
              <>
                <Input
                  id="advanced-audienceCustom"
                  placeholder="Describe the audience"
                  {...form.register('audienceCustom')}
                />
                <FieldMessage message={form.formState.errors.audienceCustom?.message} />
              </>
            ) : null}
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-inputMaterial"
              helper="Optional, but strong source material often reduces retries."
              label="Input material"
              tooltip={ADVANCED_FIELD_TOOLTIPS.inputMaterial}
            />
            <Textarea
              id="advanced-inputMaterial"
              className="min-h-[160px]"
              placeholder="Paste notes, source text, rough bullets, or requirements."
              {...form.register('inputMaterial')}
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-context"
              label="Context"
              tooltip={ADVANCED_FIELD_TOOLTIPS.context}
            />
            <Textarea
              id="advanced-context"
              placeholder="Background, constraints, relevant facts, or project details."
              {...form.register('context')}
            />
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-taskInstructions"
              label="Task instructions"
              tooltip={ADVANCED_FIELD_TOOLTIPS.taskInstructions}
            />
            <Textarea
              id="advanced-taskInstructions"
              placeholder="Specific steps, expectations, or response behaviors."
              {...form.register('taskInstructions')}
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard
        contentClassName="space-y-6"
        description="Set the voice, shape, and level of detail you want in the final answer."
        icon={FileOutput}
        title="Output design"
      >
        <div className="space-y-2">
          <TooltipLabel label="Tones" tooltip={ADVANCED_FIELD_TOOLTIPS.tones} />
          <TonePicker onToggle={toggleTone} options={TONE_OPTIONS} selected={values.tones} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-language"
              label="Language"
              tooltip={ADVANCED_FIELD_TOOLTIPS.language}
            />
            <Select id="advanced-language" {...form.register('language')}>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {values.language === 'custom' ? (
              <>
                <Input
                  id="advanced-languageCustom"
                  placeholder="Specify the language"
                  {...form.register('languageCustom')}
                />
                <FieldMessage message={form.formState.errors.languageCustom?.message} />
              </>
            ) : null}
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-outputFormat"
              helper="Strongly encouraged because it makes the output more reusable."
              label="Output format"
              tooltip={ADVANCED_FIELD_TOOLTIPS.outputFormat}
            />
            <Select id="advanced-outputFormat" {...form.register('outputFormat')}>
              {OUTPUT_FORMAT_OPTIONS.map((option) => (
                <option key={option.value || 'blank'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <FieldMessage
              message={
                !values.outputFormat
                  ? 'Leaving this blank is allowed, but choosing a format usually improves the prompt.'
                  : undefined
              }
              tone="warning"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-detailLevel"
              label="Detail level"
              tooltip={ADVANCED_FIELD_TOOLTIPS.detailLevel}
            />
            <Select id="advanced-detailLevel" {...form.register('detailLevel')}>
              {DETAIL_LEVEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-maxLength"
              label="Max length"
              tooltip={ADVANCED_FIELD_TOOLTIPS.maxLength}
            />
            <Input
              id="advanced-maxLength"
              placeholder="e.g. under 300 words"
              {...form.register('maxLength')}
            />
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-variantCount"
              label="Variant count"
              tooltip={ADVANCED_FIELD_TOOLTIPS.variantCount}
            />
            <Input
              id="advanced-variantCount"
              max={5}
              min={1}
              type="number"
              {...form.register('variantCount', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-exampleStructure"
              helper="Best for repeated tasks where structure matters more than wording."
              label="Example structure"
              tooltip={ADVANCED_FIELD_TOOLTIPS.exampleStructure}
            />
          <Textarea
            id="advanced-exampleStructure"
            placeholder="Optional outline, mini-template, or example structure."
            {...form.register('exampleStructure')}
          />
        </div>

        <div className="flex flex-col gap-3 rounded-[24px] border border-[color:var(--border)] bg-white/75 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <TooltipLabel
              label="Compact mode"
              tooltip={ADVANCED_FIELD_TOOLTIPS.compactMode}
              helper="Useful when you want a shorter prompt without changing the meaning."
            />
          </div>
          <Switch
            checked={values.compactMode}
            onCheckedChange={(checked) =>
              form.setValue('compactMode', checked, {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        </div>
      </SectionCard>

      <SectionCard
        contentClassName="space-y-6"
        description="Protect the output with explicit inclusions, exclusions, and boundaries."
        icon={ShieldCheck}
        title="Guardrails"
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-mustInclude"
              label="Must include"
              tooltip={ADVANCED_FIELD_TOOLTIPS.mustInclude}
            />
            <Textarea
              id="advanced-mustInclude"
              placeholder="Required sections, facts, keywords, or deliverables."
              {...form.register('mustInclude')}
            />
          </div>

          <div className="space-y-2">
            <TooltipLabel
              htmlFor="advanced-mustAvoid"
              label="Must avoid"
              tooltip={ADVANCED_FIELD_TOOLTIPS.mustAvoid}
            />
            <Textarea
              id="advanced-mustAvoid"
              placeholder="Jargon, unsupported claims, filler, hype, or anything else to avoid."
              {...form.register('mustAvoid')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <TooltipLabel
            htmlFor="advanced-constraints"
            label="Constraints"
            tooltip={ADVANCED_FIELD_TOOLTIPS.constraints}
          />
          <Textarea
            id="advanced-constraints"
            placeholder="Scope boundaries, compliance notes, process rules, or quality standards."
            {...form.register('constraints')}
          />
        </div>
      </SectionCard>
    </div>
  )
}
