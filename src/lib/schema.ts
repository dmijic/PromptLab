import { z } from 'zod'

import { detailLevelValues, promptTypeValues, type PromptFormData } from '@/types/prompt'

export const promptFormSchema = z
  .object({
    promptType: z.enum(promptTypeValues, {
      error: 'Choose what you want help with so PromptLab can shape the prompt.',
    }),
    role: z.string().trim(),
    objective: z
      .string()
      .trim()
      .min(10, 'Tell PromptLab a bit more about the outcome you want.'),
    context: z.string().trim(),
    inputMaterial: z.string().trim(),
    audience: z.string().trim(),
    audienceCustom: z.string().trim(),
    taskInstructions: z.string().trim(),
    tones: z.array(z.string()),
    language: z.string().trim(),
    languageCustom: z.string().trim(),
    outputFormat: z.string().trim(),
    maxLength: z.string().trim(),
    mustInclude: z.string().trim(),
    mustAvoid: z.string().trim(),
    constraints: z.string().trim(),
    exampleStructure: z.string().trim(),
    detailLevel: z.enum(detailLevelValues),
    variantCount: z.coerce.number().min(1).max(5),
    compactMode: z.boolean(),
  })
  .superRefine((values, context) => {
    if (values.audience === 'custom' && values.audienceCustom.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['audienceCustom'],
        message: 'Add the audience you have in mind.',
      })
    }

    if (values.language === 'custom' && values.languageCustom.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['languageCustom'],
        message: 'Add the language you want the response in.',
      })
    }
  })

export const defaultPromptValues: PromptFormData = {
  promptType: 'writing',
  role: '',
  objective: '',
  context: '',
  inputMaterial: '',
  audience: '',
  audienceCustom: '',
  taskInstructions: '',
  tones: [],
  language: 'English',
  languageCustom: '',
  outputFormat: '',
  maxLength: '',
  mustInclude: '',
  mustAvoid: '',
  constraints: '',
  exampleStructure: '',
  detailLevel: 'balanced',
  variantCount: 1,
  compactMode: false,
}
