import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide',
  {
    variants: {
      variant: {
        default:
          'border-[color:var(--border-strong)] bg-[color:var(--secondary)] text-[color:var(--secondary-foreground)]',
        accent:
          'border-transparent bg-[color:var(--accent-soft)] text-[color:var(--accent-foreground)]',
        success:
          'border-transparent bg-[color:var(--success-soft)] text-[color:var(--success-foreground)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ className, variant }))} {...props} />
}

export { Badge }
