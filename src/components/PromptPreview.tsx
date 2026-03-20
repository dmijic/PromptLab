import { FilePenLine, Rows4, WandSparkles } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface PromptPreviewProps {
  content: string
  emptyTitle: string
  emptyDescription: string
  hasBuilt: boolean
  previewName: string
}

export function PromptPreview({
  content,
  emptyDescription,
  emptyTitle,
  hasBuilt,
  previewName,
}: PromptPreviewProps) {
  if (!content) {
    return (
      <div className="relative overflow-hidden rounded-[30px] border border-dashed border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,252,0.96))] px-6 py-8">
        <div className="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-[color:var(--accent-soft)] blur-2xl" />
        <div className="relative flex min-h-[320px] flex-col justify-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--secondary)] text-[color:var(--primary)]">
            <FilePenLine className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold text-[color:var(--foreground)]">{emptyTitle}</h3>
          <p className="mt-2 max-w-md text-sm leading-7 text-[color:var(--muted-foreground)]">
            {emptyDescription}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/70 bg-white/85 p-4">
              <WandSparkles className="mb-2 h-4.5 w-4.5 text-[color:var(--accent)]" />
              <p className="text-sm font-semibold text-[color:var(--foreground)]">What you will get</p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                A structured prompt that is easier to paste into your tool of choice.
              </p>
            </div>
            <div className="rounded-[22px] border border-white/70 bg-white/85 p-4">
              <Rows4 className="mb-2 h-4.5 w-4.5 text-[color:var(--primary)]" />
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                How live syncing works
              </p>
              <p className="mt-1 text-sm leading-6 text-[color:var(--muted-foreground)]">
                Build once on the final step, then edits stay reflected here automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const lineCount = content.split('\n').length
  const characterCount = content.length

  return (
    <div className="overflow-hidden rounded-[30px] border border-[color:var(--border-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(249,250,251,0.98))] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
      <div className="flex flex-col gap-3 border-b border-[color:var(--border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.88))] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`h-2.5 w-2.5 rounded-full ${hasBuilt ? 'bg-emerald-500 shadow-[0_0_0_5px_rgba(16,185,129,0.12)]' : 'bg-[color:var(--accent)] shadow-[0_0_0_5px_rgba(239,123,69,0.12)]'}`}
          />
          <p className="text-sm font-semibold text-[color:var(--foreground)]">{previewName}</p>
          <Badge variant={hasBuilt ? 'success' : 'accent'}>
            {hasBuilt ? 'Live sync on' : 'Draft preview'}
          </Badge>
        </div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
          {lineCount} lines · {characterCount} characters
        </p>
      </div>

      <div className="relative min-h-[320px] bg-[linear-gradient(180deg,rgba(255,250,245,0.55),rgba(255,255,255,0.72))]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(transparent_31px,rgba(20,122,123,0.05)_32px)] bg-[length:100%_32px]" />
        <pre className="relative max-h-[520px] overflow-x-auto whitespace-pre-wrap break-words px-5 py-5 font-mono text-[13px] leading-8 text-slate-800">
          {content}
        </pre>
      </div>
    </div>
  )
}
