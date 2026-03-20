import { AlertCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

interface FieldMessageProps {
  message?: string
  tone?: 'error' | 'warning'
}

export function FieldMessage({ message, tone = 'error' }: FieldMessageProps) {
  if (!message) {
    return null
  }

  return (
    <p
      className={cn(
        'flex items-start gap-2 text-sm leading-6',
        tone === 'error' ? 'text-rose-600' : 'text-amber-700',
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </p>
  )
}
