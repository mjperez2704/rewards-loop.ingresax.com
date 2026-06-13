'use client'

import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import {
  money,
  planName,
  plans,
  statusCopy,
} from '@/components/admin/admin-utils'
import type { AdminBusinessAccount } from '@/app/actions/admin-accounts'

export function AdminPlansPage({ accounts }: { accounts: AdminBusinessAccount[] }) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? '')
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]

  if (!selectedAccount) {
    return (
      <div className="product-shell">
        <Card className="premium-card p-6">
          <p className="product-kicker">Planes y suscripciones</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin cuentas registradas</h2>
          <p className="mt-2 text-sm text-muted-foreground">Las suscripciones aparecerán cuando exista al menos una cuenta de negocio.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">Planes y suscripciones</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Control comercial</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Administra limites, modulos incluidos, cambios de plan y estado de suscripcion por cuenta SaaS.
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

          <div className="mt-6 space-y-3">
            {[
              ['Plan actual', planName(selectedAccount.plan)],
              ['Estado', statusCopy[selectedAccount.status].label],
              ['MRR', money(selectedAccount.mrr)],
              ['Usuarios', `${selectedAccount.limits.users.used} / ${selectedAccount.limits.users.limit}`],
            ].map(([label, value]) => (
              <div key={label} className="premium-card-muted flex items-center justify-between p-4">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-5">
          <div className="flex flex-col gap-2 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="product-kicker">Catalogo de planes</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">Opciones disponibles</h2>
            </div>
            <Badge variant="outline" className={statusCopy[selectedAccount.status].className}>
              {statusCopy[selectedAccount.status].label}
            </Badge>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={cn(
                  'rounded-lg border p-5',
                  selectedAccount.plan === plan.id ? 'border-primary bg-muted/40' : 'border-border',
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold">{plan.name}</p>
                    <p className="mt-1 text-2xl font-semibold">{plan.price}<span className="text-sm font-normal text-muted-foreground"> / mes</span></p>
                  </div>
                  {selectedAccount.plan === plan.id && (
                    <Badge className="bg-primary text-primary-foreground">Actual</Badge>
                  )}
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {[plan.accounts, plan.customers, plan.modules].map((item) => (
                    <p key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-brand-teal" />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-border bg-muted/40 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold">Acciones de suscripcion</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Cambiar plan, pausar cuenta, extender prueba o bloquear modulos por falta de pago.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline">Extender prueba</Button>
                <Button variant="outline">Pausar cuenta</Button>
                <Button>Actualizar plan</Button>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
