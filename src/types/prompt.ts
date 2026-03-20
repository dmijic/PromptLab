export const promptTypeValues = [
  'writing',
  'email',
  'research',
  'coding',
  'business',
  'marketing',
  'learning',
  'custom',
] as const

export const detailLevelValues = ['short', 'balanced', 'detailed'] as const

export type PromptType = (typeof promptTypeValues)[number]
export type DetailLevel = (typeof detailLevelValues)[number]
export type BuilderMode = 'basic' | 'advanced'
export type PromptScoreLabel = 'Weak' | 'Basic' | 'Strong' | 'Excellent'

export interface PromptFormData {
  promptType: PromptType
  role: string
  objective: string
  context: string
  inputMaterial: string
  audience: string
  audienceCustom: string
  taskInstructions: string
  tones: string[]
  language: string
  languageCustom: string
  outputFormat: string
  maxLength: string
  mustInclude: string
  mustAvoid: string
  constraints: string
  exampleStructure: string
  detailLevel: DetailLevel
  variantCount: number
  compactMode: boolean
}

export interface PromptSuggestion {
  id: string
  title: string
  description: string
}

export interface PromptScoreBreakdown {
  goalClarity: number
  contextCompleteness: number
  audienceDefinition: number
  taskSpecificity: number
  constraints: number
  toneStyleDefinition: number
  outputFormatClarity: number
  inputMaterialRichness: number
}

export interface PromptScoreResult {
  total: number
  label: PromptScoreLabel
  breakdown: PromptScoreBreakdown
}

export interface EfficiencyMetrics {
  structureImprovement: number
  estimatedRetryReduction: number
  estimatedTokenEfficiencyGain: number
  completeness: number
}
