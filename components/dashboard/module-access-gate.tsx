'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getServiceModuleByPath } from '@/lib/service-modules'
import type { ServiceEntitlements } from '@/lib/service-modules'

export function ModuleAccessGate({
  accountName,
  entitlements,
  children,
}: {
  accountName: string
  entitlements: ServiceEntitlements
  children: ReactNode
}) {
  const pathname = usePathname()
  const module = getServiceModuleByPath(pathname)

  if (entitlements[module.key]) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-[calc(100svh-8rem)] items-center justify-center">
      <div className="premium-card w-full max-w-xl p-8 text-center">
        <div className="mx-auto premium-icon-soft size-14">
          <LockKeyhole className="size-7 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <Badge variant="outline" className="status-muted mt-5">
          <ShieldCheck className="size-3" />
          Microservicio desactivado
        </Badge>
        <h1 className="mt-4 text-2xl font-semibold tracking-normal">{module.name} no está activo</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          El dashboard maestro desactivó este módulo para {accountName}. La cuenta conserva el acceso a los
          demás servicios habilitados.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/dashboard">Volver al resumen</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin">Abrir dashboard maestro</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
