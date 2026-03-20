import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SectionCardProps {
  title: string
  description: string
  children: ReactNode
  icon?: LucideIcon
  action?: ReactNode
  contentClassName?: string
}

export function SectionCard({
  action,
  children,
  contentClassName,
  description,
  icon: Icon,
  title,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            {Icon ? (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--secondary),white)] text-[color:var(--primary)]">
                <Icon className="h-5 w-5" />
              </div>
            ) : null}
            <div className="space-y-1">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  )
}
