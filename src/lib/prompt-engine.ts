import type {
  EfficiencyMetrics,
  PromptFormData,
  PromptScoreBreakdown,
  PromptScoreLabel,
  PromptScoreResult,
  PromptSuggestion,
  PromptType,
} from '@/types/prompt'

const DEFAULT_ROLES: Record<PromptType, string> = {
  writing: 'You are an expert writer.',
  email: 'You are a professional communication assistant.',
  research: 'You are a careful research assistant.',
  coding: 'You are an experienced software developer.',
  business: 'You are a business strategy assistant.',
  marketing: 'You are a marketing expert.',
  learning: 'You are a patient teacher.',
  custom: 'You are a helpful expert assistant.',
}

const DEFAULT_TASKS: Record<PromptType, string> = {
  writing: 'Create a polished response that fulfills the objective and reads naturally.',
  email: 'Draft a clear, ready-to-send email that directly supports the objective.',
  research: 'Explain the topic carefully and synthesize the most relevant points.',
  coding: 'Provide a practical implementation-focused answer that solves the task directly.',
  business: 'Recommend actionable business thinking that supports the stated goal.',
  marketing: 'Create audience-aware messaging with a clear value proposition.',
  learning: 'Teach the topic clearly and make it easy to understand.',
  custom: 'Complete the task directly and helpfully.',
}

const clean = (value: string | undefined) => value?.trim() ?? ''

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const sentence = (value: string) => {
  const trimmed = clean(value)

  if (!trimmed) {
    return ''
  }

  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`
}

const scoreText = (
  value: string,
  max: number,
  thresholds: { strong: number; medium: number; light: number },
) => {
  const length = clean(value).length

  if (length === 0) {
    return 0
  }

  if (length >= thresholds.strong) {
    return max
  }

  if (length >= thresholds.medium) {
    return Math.round(max * 0.8)
  }

  if (length >= thresholds.light) {
    return Math.round(max * 0.55)
  }

  return Math.round(max * 0.35)
}

const scoreTaskSpecificity = (formData: PromptFormData) => {
  let points = 0

  if (clean(formData.taskInstructions)) {
    points += scoreText(formData.taskInstructions, 12, {
      strong: 140,
      medium: 70,
      light: 24,
    })
  } else if (clean(formData.objective)) {
    points += 6
  }

  if (clean(formData.mustInclude)) {
    points += 4
  }

  if (clean(formData.outputFormat)) {
    points += 3
  }

  if (formData.variantCount > 1) {
    points += 3
  }

  return clamp(points, 0, 20)
}

const scoreConstraints = (formData: PromptFormData) => {
  let points = 0

  if (clean(formData.constraints)) {
    points += 4
  }

  if (clean(formData.maxLength)) {
    points += 2
  }

  if (clean(formData.mustAvoid)) {
    points += 2
  }

  if (clean(formData.mustInclude)) {
    points += 2
  }

  return clamp(points, 0, 10)
}

const getQualityLabel = (score: number): PromptScoreLabel => {
  if (score <= 39) {
    return 'Weak'
  }

  if (score <= 59) {
    return 'Basic'
  }

  if (score <= 79) {
    return 'Strong'
  }

  return 'Excellent'
}

const buildSection = (title: string, content: string) => (content ? `${title}:\n${content}` : '')

const formatJoinedList = (values: string[]) => values.filter(Boolean).join(', ')

const getConstraintSummary = (formData: PromptFormData) =>
  [
    clean(formData.constraints),
    clean(formData.maxLength) ? `Keep the response within ${clean(formData.maxLength)}.` : '',
    formData.variantCount > 1
      ? `Provide ${formData.variantCount} distinct variations where it makes sense.`
      : '',
    formData.compactMode ? 'Use compact instruction wording and skip unnecessary preamble.' : '',
  ]
    .filter(Boolean)
    .join('\n')

const normalizeRole = (role: string, promptType: PromptType) => {
  const value = clean(role) || getDefaultRole(promptType)

  if (/^you are\b/i.test(value)) {
    return sentence(value)
  }

  return sentence(`You are ${value}`)
}

export function getDefaultRole(promptType: PromptType) {
  return DEFAULT_ROLES[promptType]
}

export function resolveAudienceValue(formData: PromptFormData) {
  return formData.audience === 'custom'
    ? clean(formData.audienceCustom)
    : clean(formData.audience)
}

export function resolveLanguageValue(formData: PromptFormData) {
  if (formData.language === 'custom') {
    return clean(formData.languageCustom)
  }

  return clean(formData.language) || 'English'
}

export function formatToneStyle(formData: PromptFormData) {
  return formatJoinedList(formData.tones)
}

export function normalizeTaskInstructions(formData: PromptFormData) {
  const instructions: string[] = []

  if (clean(formData.taskInstructions)) {
    instructions.push(clean(formData.taskInstructions))
  } else {
    instructions.push(DEFAULT_TASKS[formData.promptType])
  }

  if (clean(formData.inputMaterial)) {
    instructions.push('Use the supplied input material when it is relevant.')
  }

  if (formData.detailLevel === 'short') {
    instructions.push('Favor brevity and directness.')
  }

  if (formData.detailLevel === 'detailed') {
    instructions.push('Include useful nuance and explain key tradeoffs.')
  }

  if (formData.variantCount > 1) {
    instructions.push(`Return ${formData.variantCount} clearly differentiated versions.`)
  }

  if (formData.compactMode) {
    instructions.push('Keep the response concise and avoid unnecessary framing.')
  }

  return instructions.join(' ')
}

export function buildFullPrompt(formData: PromptFormData) {
  const audience = resolveAudienceValue(formData)
  const language = resolveLanguageValue(formData)
  const toneStyle = formatToneStyle(formData)
  const constraints = getConstraintSummary(formData)
  const normalizedTask = normalizeTaskInstructions(formData)

  return [
    normalizeRole(formData.role, formData.promptType),
    buildSection('Objective', clean(formData.objective)),
    buildSection('Context', clean(formData.context)),
    buildSection('Input material', clean(formData.inputMaterial)),
    buildSection('Target audience', audience),
    buildSection('Task', normalizedTask),
    buildSection('Tone and style', toneStyle),
    buildSection('Constraints', constraints),
    buildSection('Must include', clean(formData.mustInclude)),
    buildSection('Must avoid', clean(formData.mustAvoid)),
    buildSection('Output format', clean(formData.outputFormat)),
    buildSection('Response language', language),
    buildSection('Detail level', clean(formData.detailLevel)),
    buildSection(
      'If helpful, follow this example or structure',
      clean(formData.exampleStructure),
    ),
  ]
    .filter(Boolean)
    .join('\n\n')
}

export function buildCompactPrompt(formData: PromptFormData) {
  const audience = resolveAudienceValue(formData)
  const language = resolveLanguageValue(formData)
  const toneStyle = formatToneStyle(formData)
  const constraints = getConstraintSummary(formData).replaceAll('\n', ' ')
  const normalizedTask = normalizeTaskInstructions(formData)

  return [
    normalizeRole(formData.role, formData.promptType),
    clean(formData.objective) ? `Objective: ${clean(formData.objective)}` : '',
    clean(formData.context) ? `Context: ${clean(formData.context)}` : '',
    clean(formData.inputMaterial)
      ? `Input material: ${clean(formData.inputMaterial)}`
      : '',
    audience ? `Audience: ${audience}` : '',
    normalizedTask ? `Task: ${normalizedTask}` : '',
    toneStyle ? `Tone: ${toneStyle}` : '',
    constraints ? `Constraints: ${constraints}` : '',
    clean(formData.mustInclude) ? `Include: ${clean(formData.mustInclude)}` : '',
    clean(formData.mustAvoid) ? `Avoid: ${clean(formData.mustAvoid)}` : '',
    clean(formData.outputFormat) ? `Format: ${clean(formData.outputFormat)}` : '',
    language ? `Language: ${language}` : '',
    clean(formData.detailLevel) ? `Detail: ${clean(formData.detailLevel)}` : '',
    clean(formData.exampleStructure)
      ? `Structure reference: ${clean(formData.exampleStructure)}`
      : '',
  ]
    .filter(Boolean)
    .join(' | ')
}

export function buildSuggestions(formData: PromptFormData): PromptSuggestion[] {
  const suggestions: PromptSuggestion[] = []

  if (clean(formData.objective).length < 24) {
    suggestions.push({
      id: 'objective',
      title: 'Clarify the goal',
      description:
        'Make the objective a little more specific so the prompt has a sharper success target.',
    })
  }

  if (!clean(formData.context)) {
    suggestions.push({
      id: 'context',
      title: 'Add more context',
      description: 'Share the background or situation so the response can be better grounded.',
    })
  }

  if (!resolveAudienceValue(formData)) {
    suggestions.push({
      id: 'audience',
      title: 'Define the audience',
      description:
        'Call out who the answer is for so the wording and framing feel more intentional.',
    })
  }

  if (!clean(formData.outputFormat)) {
    suggestions.push({
      id: 'format',
      title: 'Specify the output format',
      description:
        'Formats like bullet list, report, or email draft usually make the result more reliable.',
    })
  }

  if (!getConstraintSummary(formData)) {
    suggestions.push({
      id: 'constraints',
      title: 'Add constraints',
      description:
        'Length, scope, and must-avoid rules reduce back-and-forth and tighten the response.',
    })
  }

  if (formData.tones.length === 0) {
    suggestions.push({
      id: 'tone',
      title: 'Choose a tone',
      description:
        'A tone or style hint helps the answer feel closer to the voice you actually want.',
    })
  }

  if (!clean(formData.inputMaterial)) {
    suggestions.push({
      id: 'material',
      title: 'Add source material if you have it',
      description:
        'Notes, examples, and raw input often improve accuracy and reduce the need for retries.',
    })
  }

  return suggestions.slice(0, 6)
}

export function calculatePromptScore(formData: PromptFormData): PromptScoreResult {
  const audience = resolveAudienceValue(formData)

  const breakdown: PromptScoreBreakdown = {
    goalClarity: scoreText(formData.objective, 20, {
      strong: 100,
      medium: 45,
      light: 18,
    }),
    contextCompleteness: scoreText(formData.context, 15, {
      strong: 140,
      medium: 70,
      light: 24,
    }),
    audienceDefinition: audience ? 10 : 0,
    taskSpecificity: scoreTaskSpecificity(formData),
    constraints: scoreConstraints(formData),
    toneStyleDefinition: clamp((formData.tones.length > 0 ? formData.tones.length * 3 : 0) + 2, 0, 10),
    outputFormatClarity: clean(formData.outputFormat) ? 10 : 0,
    inputMaterialRichness: scoreText(formData.inputMaterial, 5, {
      strong: 160,
      medium: 70,
      light: 18,
    }),
  }

  const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0)

  return {
    total,
    label: getQualityLabel(total),
    breakdown,
  }
}

export function calculateEfficiencyMetrics(formData: PromptFormData): EfficiencyMetrics {
  const score = calculatePromptScore(formData)
  const completenessInputs = [
    clean(formData.objective),
    clean(formData.context),
    clean(formData.inputMaterial),
    resolveAudienceValue(formData),
    clean(formData.taskInstructions),
    formData.tones.length > 0 ? 'tones' : '',
    clean(formData.outputFormat),
    getConstraintSummary(formData),
    clean(formData.exampleStructure),
    resolveLanguageValue(formData),
  ]

  const completeness = Math.round(
    (completenessInputs.filter(Boolean).length / completenessInputs.length) * 100,
  )

  return {
    structureImprovement: clamp(
      Math.round(
        18 +
          completeness * 0.55 +
          (clean(formData.outputFormat) ? 8 : 0) +
          (resolveAudienceValue(formData) ? 5 : 0),
      ),
      0,
      96,
    ),
    estimatedRetryReduction: clamp(
      Math.round(
        10 +
          score.total * 0.5 +
          (clean(formData.context) ? 4 : 0) +
          (formData.tones.length > 0 ? 4 : 0),
      ),
      0,
      91,
    ),
    estimatedTokenEfficiencyGain: clamp(
      Math.round(
        7 +
          score.breakdown.outputFormatClarity +
          score.breakdown.constraints +
          (formData.compactMode ? 12 : 0) +
          (clean(formData.maxLength) ? 4 : 0),
      ),
      0,
      79,
    ),
    completeness,
  }
}
