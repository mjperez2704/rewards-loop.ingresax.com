import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow: string
  title: ReactNode
  description: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('product-page-header', className)}>
      <div>
        <p className="product-kicker">{eyebrow}</p>
        <h1 className="product-title">{title}</h1>
        <p className="product-description">{description}</p>
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
