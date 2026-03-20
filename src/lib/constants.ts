import type { PromptFormData } from '@/types/prompt'
import type { DetailLevel, PromptType } from '@/types/prompt'

export const PROMPT_TYPE_OPTIONS: Array<{
  value: PromptType
  label: string
  description: string
}> = [
  {
    value: 'writing',
    label: 'Writing',
    description: 'Articles, scripts, product copy, and creative drafts.',
  },
  {
    value: 'email',
    label: 'Email',
    description: 'Professional messages, replies, follow-ups, and outreach.',
  },
  {
    value: 'research',
    label: 'Research',
    description: 'Summaries, comparisons, background briefs, and analysis.',
  },
  {
    value: 'coding',
    label: 'Coding',
    description: 'Implementation plans, debugging help, and code generation.',
  },
  {
    value: 'business',
    label: 'Business',
    description: 'Strategy notes, proposals, internal plans, and decisions.',
  },
  {
    value: 'marketing',
    label: 'Marketing',
    description: 'Campaign angles, positioning, copy ideas, and messaging.',
  },
  {
    value: 'learning',
    label: 'Learning',
    description: 'Lessons, explanations, study guides, and tutoring prompts.',
  },
  {
    value: 'custom',
    label: 'Custom',
    description: 'A flexible starting point when your task does not fit a preset.',
  },
]

export const AUDIENCE_OPTIONS = [
  { value: '', label: 'No specific audience yet' },
  { value: 'general audience', label: 'General audience' },
  { value: 'customers', label: 'Customers' },
  { value: 'executives', label: 'Executives' },
  { value: 'students', label: 'Students' },
  { value: 'team members', label: 'Team members' },
  { value: 'developers', label: 'Developers' },
  { value: 'custom', label: 'Custom audience' },
]

export const LANGUAGE_OPTIONS = [
  { value: 'English', label: 'English' },
  { value: 'Croatian', label: 'Croatian' },
  { value: 'German', label: 'German' },
  { value: 'Spanish', label: 'Spanish' },
  { value: 'French', label: 'French' },
  { value: 'Italian', label: 'Italian' },
  { value: 'custom', label: 'Custom language' },
]

export const DETAIL_LEVEL_OPTIONS: Array<{
  value: DetailLevel
  label: string
  description: string
}> = [
  {
    value: 'short',
    label: 'Short',
    description: 'Fast, direct, and skim-friendly.',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    description: 'Clear depth without over-explaining.',
  },
  {
    value: 'detailed',
    label: 'Detailed',
    description: 'Thorough and nuance-aware.',
  },
]

export const OUTPUT_FORMAT_OPTIONS = [
  { value: '', label: 'Choose a format' },
  { value: 'bullet list', label: 'Bullet list' },
  { value: 'paragraphs', label: 'Paragraphs' },
  { value: 'email draft', label: 'Email draft' },
  { value: 'table', label: 'Table' },
  { value: 'step-by-step plan', label: 'Step-by-step plan' },
  { value: 'report', label: 'Report' },
  { value: 'presentation outline', label: 'Presentation outline' },
  { value: 'social post variations', label: 'Social post variations' },
  { value: 'json', label: 'JSON' },
]

export const TONE_OPTIONS = [
  'Friendly',
  'Professional',
  'Confident',
  'Concise',
  'Persuasive',
  'Empathetic',
  'Analytical',
  'Playful',
  'Authoritative',
  'Encouraging',
] as const

export const ADVANCED_FIELD_TOOLTIPS: Record<keyof PromptFormData, string> = {
  promptType: 'Pick the task family so PromptLab can choose a sensible starting role.',
  role: 'Use this only when you want a very specific expert voice.',
  objective: 'State the outcome, not just the topic.',
  context: 'Add background that changes what a good answer should look like.',
  inputMaterial: 'Paste notes or source text you want the response to use.',
  audience: 'Name the reader so tone and framing fit better.',
  audienceCustom: 'Use a custom audience when the presets are too broad.',
  taskInstructions: 'List any explicit steps, priorities, or behaviors to follow.',
  tones: 'Choose how the response should feel to the reader.',
  language: 'Select the language you want back.',
  languageCustom: 'Use this when your language is not listed.',
  outputFormat: 'Define the final shape so the answer is easier to reuse.',
  maxLength: 'Useful when you need a short answer or a hard cap.',
  mustInclude: 'Add the points or sections that cannot be missed.',
  mustAvoid: 'Call out wording, claims, or patterns to avoid.',
  constraints: 'Add boundaries such as scope, policy, or process rules.',
  exampleStructure: 'Provide a mini template when format matters a lot.',
  detailLevel: 'Choose whether the answer should be brief, balanced, or thorough.',
  variantCount: 'Ask for multiple versions when you want options to compare.',
  compactMode: 'Tightens the generated prompt for leaner copy-paste use.',
}

export const SCORE_MAX = 100
