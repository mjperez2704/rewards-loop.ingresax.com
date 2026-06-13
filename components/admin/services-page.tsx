'use client'

import { useMemo, useState } from 'react'
import { Lock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { moduleIcons } from '@/components/admin/admin-utils'
import { cn } from '@/lib/utils'
import {
  SERVICE_MODULES,
  mergeServiceEntitlements,
} from '@/lib/service-modules'
import type { ServiceModuleKey } from '@/lib/service-modules'
import {
  updateAccountModuleEntitlement,
} from '@/app/actions/admin-accounts'
import type { AdminBusinessAccount } from '@/app/actions/admin-accounts'

export function AdminServicesPage({ accounts: initialAccounts }: { accounts: AdminBusinessAccount[] }) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccounts[0]?.id ?? '')
  const [savingKey, setSavingKey] = useState<ServiceModuleKey | null>(null)

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const selectedEntitlements = useMemo(() => {
    return mergeServiceEntitlements(selectedAccount?.serviceEntitlements)
  }, [selectedAccount?.serviceEntitlements])

  const setModuleEnabled = async (accountId: string, key: ServiceModuleKey, enabled: boolean) => {
    if (key === 'dashboard') return

    setSavingKey(key)
    const nextAccounts = await updateAccountModuleEntitlement(accountId, key, enabled)
    setAccounts(nextAccounts)
    setSavingKey(null)
  }

  if (!selectedAccount) {
    return (
      <div className="product-shell">
        <Card className="premium-card p-6">
          <p className="product-kicker">Microservicios</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin cuentas registradas</h2>
          <p className="mt-2 text-sm text-muted-foreground">Los módulos podrán activarse cuando exista al menos una cuenta de negocio.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">Microservicios</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Control por cuenta</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Cada opcion del panel del negocio funciona como modulo activable por cliente. El panel principal permanece activo para conservar el acceso operativo de la cuenta.
          </p>

          <div className="mt-6">
            <label className="text-sm font-medium">Cuenta</label>
            <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
              <SelectTrigger className="mt-2 w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.businessName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ['Plan', selectedAccount.plan],
              ['Usuarios', selectedAccount.users],
              ['Clientes', selectedAccount.customers.toLocaleString()],
              ['Modulos', Object.values(selectedEntitlements).filter(Boolean).length],
            ].map(([label, value]) => (
              <div key={label} className="premium-card-muted p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-5">
          <div className="flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="product-kicker">Acceso modular</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">{selectedAccount.businessName}</h2>
            </div>
            <Badge variant="outline">Cambios persistidos</Badge>
          </div>

          <div className="mt-5 space-y-3">
            {SERVICE_MODULES.map((module) => {
              const Icon = moduleIcons[module.key]
              const enabled = selectedEntitlements[module.key]
              const locked = module.key === 'dashboard'

              return (
                <div key={module.key} className="premium-card-muted flex items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-lg', enabled ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground')}>
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{module.name}</p>
                        <Badge variant="secondary">{module.category}</Badge>
                        {locked && <Badge variant="outline"><Lock className="size-3" /> Principal</Badge>}
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn('hidden text-xs font-semibold sm:block', enabled ? 'text-brand-success' : 'text-muted-foreground')}>
                      {enabled ? 'Activo' : 'Inactivo'}
                    </span>
                    <Switch
                      checked={enabled}
                      disabled={locked}
                      onCheckedChange={(checked) => setModuleEnabled(selectedAccount.id, module.key, checked)}
                      aria-label={`Cambiar módulo ${module.name}`}
                    />
                    {savingKey === module.key && <span className="text-xs text-muted-foreground">Guardando...</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
