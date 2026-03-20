# PromptLab

**PromptLab** is a frontend-only web app for building better AI prompts through structured input.

Instead of asking users to know prompt engineering principles in advance, PromptLab guides them through the right questions and turns their answers into a clear, reusable, high-quality prompt.

It is designed for two audiences:

- **non-technical users** who want better AI results without learning prompt engineering from scratch
- **faster-moving power users** who want a compact interface for assembling strong prompts quickly

## What it does

PromptLab helps users move from a rough idea to a more reliable prompt by combining:

- guided input
- rule-based prompt generation
- heuristic quality scoring
- lightweight efficiency insights
- actionable suggestions when important context is missing

The MVP is intentionally **frontend-only** and **not AI-powered**. It does not call an LLM to optimize prompts. Instead, it uses structured forms, templates, and heuristics to produce better prompts in a predictable and transparent way.

## Core features

### Basic mode

A friendly multi-step wizard for non-technical users.

Includes:

- up to 5 simple steps
- guided microcopy and examples
- predefined options where possible
- live review before prompt generation
- low-friction UX designed to feel approachable and playful

### Advanced mode

A compact single-screen form for users who want more control and speed.

Includes:

- denser layout
- more free-text inputs
- tooltips and helper text for every key field
- greater flexibility over prompt structure

### Rule-based prompt generation

PromptLab generates two prompt variants:

- **Full Prompt** — more explicit, more context-rich
- **Compact Prompt** — shorter version for faster copy/paste use

Generation is based on form data + predefined templates, not AI rewriting.

### Prompt Quality Score

A heuristic score that estimates how well-defined the prompt is.

Current scoring dimensions:

- goal clarity
- context completeness
- audience definition
- task specificity
- constraints
- tone/style definition
- output format clarity
- input material richness

### Efficiency Insights

A lightweight dashboard that estimates likely improvement from better prompt structure.

Includes:

- structure improvement
- estimated retry reduction
- estimated token efficiency gain
- completeness

> These are **heuristic indicators**, not real measurements of model energy consumption or API token billing.

### Suggestions engine

PromptLab highlights missing pieces that would likely improve output quality, for example:

- add more context
- define the audience
- specify the output format
- add constraints
- choose a tone

## Tech stack

- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **shadcn-style UI primitives**
- **React Hook Form**
- **Zod**
- **Lucide React**

## Local development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

## Production build

Create a production build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## Linting

```bash
npm run lint
```

## Project structure

```text
src/
  components/
    ui/           # shadcn-style UI primitives
    forms/        # small reusable form helpers
    *.tsx         # feature components and layout
  lib/
    constants.ts
    prompt-engine.ts
    schema.ts
    utils.ts
  types/
    prompt.ts
  App.tsx
  index.css
  main.tsx
```

## How PromptLab works

PromptLab collects structured user input such as:

- prompt type
- objective
- context
- audience
- tone
- output format
- constraints

It then:

1. assigns or derives a suitable role
2. normalizes missing task instructions where possible
3. builds a full prompt template
4. builds a compact prompt variant
5. calculates a heuristic quality score
6. estimates likely efficiency improvement
7. suggests missing elements that would strengthen the prompt

## Design principles

The MVP is built around these principles:

- **clarity over magic** — users should understand why the prompt is better
- **structure over guesswork** — better inputs create better outputs
- **friendly for beginners** — simple onboarding through form design
- **fast for advanced users** — compact mode for power users
- **future-proof architecture** — ready for accounts, saved history, backend APIs, and model-specific adaptations

## Current limitations

- no authentication
- no saved prompt history
- no backend or database
- no direct integration with ChatGPT, Claude, Gemini, Copilot, or Perplexity
- no landing page in the current MVP
- no real token billing or energy measurement

## Planned phase 2

Planned future upgrades include:

- authentication
- saved prompt history
- favorites / reusable prompt library
- model-specific prompt adaptation
- direct integrations with major AI tools
- landing page and public product marketing site
- analytics and team/workspace features

## Notes

- Prompt generation is **rule-based**, not AI-powered.
- Efficiency metrics are **heuristic approximations** intended to communicate likely gains in clarity and iteration efficiency.
- The current structure is intentionally ready for future additions such as auth, saved history, backend APIs, and model-specific prompt adaptations.
