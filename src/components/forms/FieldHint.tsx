import { Lightbulb } from 'lucide-react'

interface FieldHintProps {
  helper?: string
  example?: string
}

export function FieldHint({ example, helper }: FieldHintProps) {
  if (!helper && !example) {
    return null
  }

  return (
    <div className="space-y-2 pt-1.5">
      {helper ? (
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">{helper}</p>
      ) : null}
      {example ? (
        <div className="inline-flex max-w-full items-start gap-2 rounded-2xl bg-[color:var(--secondary)] px-3 py-2 text-sm text-[color:var(--secondary-foreground)]">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" />
          <span className="leading-6">{example}</span>
        </div>
      ) : null}
    </div>
  )
}
