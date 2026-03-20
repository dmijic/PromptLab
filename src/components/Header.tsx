import { FlaskConical, Orbit, Sparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(255,246,236,0.95))] px-6 py-7 shadow-[0_28px_80px_rgba(15,23,42,0.1)] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-[radial-gradient(circle_at_center,rgba(20,122,123,0.11),transparent_52%)] lg:block" />
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-4">
          <Badge className="w-fit" variant="accent">
            Rule-based prompt studio
          </Badge>
          <div className="space-y-2">
            <h1 className="font-display text-4xl font-semibold tracking-[-0.04em] text-[color:var(--foreground)] sm:text-5xl">
              PromptLab
            </h1>
            <p className="text-lg font-medium text-[color:var(--muted-foreground)]">
              Build better prompts faster
            </p>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-[color:var(--muted-foreground)] sm:text-[15px]">
            Structure the ask, add the right guardrails, and generate a polished prompt with
            transparent heuristics instead of an opaque optimizer.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
            <Orbit className="mb-2 h-5 w-5 text-[color:var(--primary)]" />
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Basic + Advanced</p>
            <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
              One guided flow and one power-user flow.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
            <FlaskConical className="mb-2 h-5 w-5 text-[color:var(--accent)]" />
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Heuristic scoring</p>
            <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
              Clear quality signals and improvement suggestions.
            </p>
          </div>
          <div className="rounded-[24px] border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
            <Sparkles className="mb-2 h-5 w-5 text-[#f97316]" />
            <p className="text-sm font-semibold text-[color:var(--foreground)]">Frontend only</p>
            <p className="text-xs leading-5 text-[color:var(--muted-foreground)]">
              Works locally today and is ready for phase 2.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
