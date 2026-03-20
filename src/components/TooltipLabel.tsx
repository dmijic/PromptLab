import { Label } from '@/components/ui/label'

import { InfoTooltip } from '@/components/InfoTooltip'

interface TooltipLabelProps {
  htmlFor?: string
  label: string
  tooltip: string
  helper?: string
  required?: boolean
}

export function TooltipLabel({
  helper,
  htmlFor,
  label,
  required = false,
  tooltip,
}: TooltipLabelProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={htmlFor}>
          {label}
          {required ? <span className="ml-1 text-[color:var(--accent)]">*</span> : null}
        </Label>
        <InfoTooltip content={tooltip} />
      </div>
      {helper ? (
        <p className="text-sm leading-6 text-[color:var(--muted-foreground)]">{helper}</p>
      ) : null}
    </div>
  )
}
