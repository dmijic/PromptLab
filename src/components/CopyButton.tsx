import { useEffect, useState } from 'react'
import { Check, Copy } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  disabled?: boolean
  value: string
}

export function CopyButton({ disabled = false, value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return undefined
    }

    const timeout = window.setTimeout(() => setCopied(false), 1800)

    return () => window.clearTimeout(timeout)
  }, [copied])

  const handleCopy = async () => {
    if (disabled || !value) {
      return
    }

    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <Button
      className={copied ? 'motion-safe:animate-[copy-pop_240ms_ease-out]' : ''}
      disabled={disabled}
      onClick={handleCopy}
      size="sm"
      type="button"
      variant="outline"
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied to clipboard' : 'Copy'}
    </Button>
  )
}
