'use client'

import { useMemo, useState } from 'react'
import { Search, ShieldAlert } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  money,
  planName,
  statusCopy,
  usagePercent,
} from '@/components/admin/admin-utils'
import {
  SERVICE_MODULES,
  mergeServiceEntitlements,
} from '@/lib/service-modules'
import type { AdminBusinessAccount } from '@/app/actions/admin-accounts'

const riskCopy = {
  low: { label: 'Sano', className: 'status-success' },
  medium: { label: 'En observación', className: 'status-warning' },
  high: { label: 'En riesgo', className: 'border-destructive/20 bg-destructive/10 text-destructive' },
}

export function AdminAccountsPage({ accounts }: { accounts: AdminBusinessAccount[] }) {
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id ?? '')
  const [query, setQuery] = useState('')

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const search = `${account.businessName} ${account.ownerName} ${account.ownerEmail} ${account.plan}`.toLowerCase()
      return search.includes(query.toLowerCase())
    })
  }, [accounts, query])
  const selectedEntitlements = mergeServiceEntitlements(selectedAccount?.serviceEntitlements)
  const selectedModules = SERVICE_MODULES.filter((module) => selectedEntitlements[module.key])

  if (!selectedAccount) {
    return (
      <div className="product-shell">
        <Card className="premium-card p-6">
          <p className="product-kicker">Cuentas SaaS</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin cuentas registradas</h2>
          <p className="mt-2 text-sm text-muted-foreground">Las cuentas aparecerán cuando existan usuarios registrados en producción.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="premium-card overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="product-kicker">Cuentas SaaS</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">Negocios registrados</h2>
              <p className="mt-1 text-sm text-muted-foreground">Negocios, dueños, planes, usuarios y estado de suscripcion.</p>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cuenta..."
                className="pl-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Negocio</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Usuarios</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id} data-state={selectedAccount.id === account.id ? 'selected' : undefined}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.businessName}</p>
                      <p className="text-xs text-muted-foreground">{account.ownerName} · {account.ownerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{planName(account.plan)}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusCopy[account.status].className}>
                      {statusCopy[account.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.users}</TableCell>
                  <TableCell>{money(account.mrr)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedAccountId(account.id)}>
                      Administrar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>

        <Card className="premium-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="product-kicker">Cuenta seleccionada</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal">{selectedAccount.businessName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selectedAccount.ownerName} · {selectedAccount.ownerEmail}</p>
            </div>
            <Badge variant="outline" className={statusCopy[selectedAccount.status].className}>
              {statusCopy[selectedAccount.status].label}
            </Badge>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              ['Plan', planName(selectedAccount.plan)],
              ['Sucursales', selectedAccount.locations],
              ['Usuarios', selectedAccount.users],
              ['Clientes', selectedAccount.customers.toLocaleString()],
              ['Impago', money(selectedAccount.billing.unpaidAmount)],
              ['Health score', `${selectedAccount.health.score}/100`],
            ].map(([label, value]) => (
              <div key={label} className="premium-card-muted p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 premium-card-muted p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">Riesgo de cuenta</p>
                <p className="mt-1 text-sm text-muted-foreground">Última actividad: {selectedAccount.health.lastActivity}</p>
              </div>
              <Badge variant="outline" className={riskCopy[selectedAccount.health.risk].className}>
                <ShieldAlert className="size-3" />
                {riskCopy[selectedAccount.health.risk].label}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedAccount.health.reasons.map((reason) => (
                <Badge key={reason} variant="outline">{reason}</Badge>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {Object.entries(selectedAccount.limits).map(([key, limit]) => (
              <div key={key}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="capitalize text-muted-foreground">{key}</span>
                  <span className="font-medium">{limit.used.toLocaleString()} / {limit.limit.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${usagePercent(limit.used, limit.limit)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="font-medium">Módulos y microservicios en uso</p>
              <Badge variant="outline">{selectedModules.length} activos</Badge>
            </div>
            <div className="grid gap-2">
              {selectedModules.map((module) => (
                <div key={module.key} className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-background px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{module.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {selectedAccount.moduleUsage[module.key] ?? module.description}
                    </p>
                  </div>
                  <Badge variant="outline" className="status-success">Activo</Badge>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
