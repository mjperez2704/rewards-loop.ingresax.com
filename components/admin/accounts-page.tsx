'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Pencil, Plus, Search, ShieldAlert, Trash2 } from 'lucide-react'
import {
  deleteBusinessAccount,
  upsertBusinessAccount,
} from '@/app/actions/admin-accounts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import type { ServicePlanRecord } from '@/app/actions/admin-plans'
import type { Dispatch, SetStateAction } from 'react'
import type { SubscriptionStatus } from '@/lib/service-modules'

const riskCopy = {
  low: { label: 'Sano', className: 'status-success' },
  medium: { label: 'En observación', className: 'status-warning' },
  high: { label: 'En riesgo', className: 'border-destructive/20 bg-destructive/10 text-destructive' },
}

type AccountForm = {
  id?: string
  businessName: string
  ownerName: string
  ownerEmail: string
  plan: string
  status: SubscriptionStatus
  locations: string
}

function emptyForm(plans: ServicePlanRecord[]): AccountForm {
  return {
    businessName: '',
    ownerName: '',
    ownerEmail: '',
    plan: plans[0]?.id ?? 'Starter',
    status: 'active',
    locations: '1',
  }
}

export function AdminAccountsPage({
  accounts: initialAccounts,
  plans,
}: {
  accounts: AdminBusinessAccount[]
  plans: ServicePlanRecord[]
}) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccounts[0]?.id ?? '')
  const [query, setQuery] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<AccountForm>(() => emptyForm(plans))
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const search = `${account.businessName} ${account.ownerName} ${account.ownerEmail} ${account.plan}`.toLowerCase()
      return search.includes(query.toLowerCase())
    })
  }, [accounts, query])
  const selectedEntitlements = mergeServiceEntitlements(selectedAccount?.serviceEntitlements)
  const selectedModules = SERVICE_MODULES.filter((module) => selectedEntitlements[module.key])

  useEffect(() => {
    setAccounts(initialAccounts)
    setSelectedAccountId((current) => (
      initialAccounts.some((account) => account.id === current)
        ? current
        : initialAccounts[0]?.id ?? ''
    ))
  }, [initialAccounts])

  const openCreate = () => {
    setError('')
    setForm(emptyForm(plans))
    setDialogOpen(true)
  }

  const openEdit = (account: AdminBusinessAccount) => {
    setError('')
    setForm({
      id: account.id,
      businessName: account.businessName,
      ownerName: account.ownerName,
      ownerEmail: account.ownerEmail,
      plan: account.plan,
      status: account.status,
      locations: String(account.locations),
    })
    setDialogOpen(true)
  }

  const saveAccount = () => {
    setError('')
    startTransition(async () => {
      try {
        const nextAccounts = await upsertBusinessAccount({
          ...form,
          locations: Number(form.locations),
        })
        setAccounts(nextAccounts)
        setSelectedAccountId(form.id ?? nextAccounts[0]?.id ?? '')
        setDialogOpen(false)
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudo guardar el negocio.')
      }
    })
  }

  const removeAccount = (id: string) => {
    setError('')
    startTransition(async () => {
      try {
        const nextAccounts = await deleteBusinessAccount(id)
        setAccounts(nextAccounts)
        setSelectedAccountId(nextAccounts[0]?.id ?? '')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudo eliminar el negocio.')
      }
    })
  }

  if (!selectedAccount) {
    return (
      <div className="product-shell">
        <Card className="premium-card p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="product-kicker">Cuentas SaaS</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin cuentas registradas</h2>
              <p className="mt-2 text-sm text-muted-foreground">Crea el primer negocio desde el administrador.</p>
            </div>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Crear negocio
            </Button>
          </div>
        </Card>
        {error && (
          <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <AccountDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          form={form}
          setForm={setForm}
          plans={plans}
          isPending={isPending}
          onSave={saveAccount}
        />
      </div>
    )
  }

  return (
    <div className="product-shell">
      {error && (
        <div className="rounded-lg border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
        <Card className="premium-card overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b border-border p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="product-kicker">Cuentas SaaS</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">Negocios registrados</h2>
              <p className="mt-1 text-sm text-muted-foreground">Negocios reales, dueños, plan, MRR y estado operativo.</p>
            </div>
            <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar cuenta..."
                  className="pl-10"
                />
              </div>
              <Button onClick={openCreate}>
                <Plus className="size-4" />
                Crear negocio
              </Button>
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredAccounts.length === 0 && (
              <div className="p-6 text-sm text-muted-foreground">No hay cuentas que coincidan con la búsqueda.</div>
            )}
            {filteredAccounts.map((account) => {
              const selected = selectedAccount.id === account.id

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`block w-full px-5 py-4 text-left transition-colors hover:bg-muted/40 ${selected ? 'bg-muted/55' : 'bg-card'}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold">{account.businessName}</p>
                        <Badge variant="outline" className={statusCopy[account.status].className}>
                          {statusCopy[account.status].label}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate text-sm text-muted-foreground">{account.ownerName} · {account.ownerEmail}</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-right md:w-72">
                      <div>
                        <p className="text-[11px] uppercase text-muted-foreground">Plan</p>
                        <p className="text-sm font-semibold">{planName(account.plan)}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase text-muted-foreground">Clientes</p>
                        <p className="text-sm font-semibold">{account.customers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase text-muted-foreground">MRR</p>
                        <p className="text-sm font-semibold">{money(account.mrr)}</p>
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        <Card className="premium-card p-5 xl:sticky xl:top-24 xl:self-start">
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

          <div className="mt-5 flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => openEdit(selectedAccount)}>
              <Pencil className="size-4" />
              Editar cuenta
            </Button>
            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => removeAccount(selectedAccount.id)} disabled={isPending}>
              <Trash2 className="size-4" />
              Eliminar
            </Button>
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
      <AccountDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        form={form}
        setForm={setForm}
        plans={plans}
        isPending={isPending}
        onSave={saveAccount}
      />
    </div>
  )
}

function AccountDialog({
  open,
  setOpen,
  form,
  setForm,
  plans,
  isPending,
  onSave,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  form: AccountForm
  setForm: Dispatch<SetStateAction<AccountForm>>
  plans: ServicePlanRecord[]
  isPending: boolean
  onSave: () => void
}) {
  const setField = (key: keyof AccountForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{form.id ? 'Editar negocio' : 'Crear negocio'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nombre del negocio</Label>
            <Input value={form.businessName} onChange={(event) => setField('businessName', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Dueño</Label>
            <Input value={form.ownerName} onChange={(event) => setField('ownerName', event.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label>Email del dueño</Label>
            <Input type="email" value={form.ownerEmail} onChange={(event) => setField('ownerEmail', event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Plan</Label>
            <Select value={form.plan} onValueChange={(value) => setField('plan', value)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {plans.filter((plan) => plan.status !== 'archived').map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={form.status} onValueChange={(value) => setField('status', value as SubscriptionStatus)}>
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Activa</SelectItem>
                <SelectItem value="trialing">Trial</SelectItem>
                <SelectItem value="past_due">Pago pendiente</SelectItem>
                <SelectItem value="paused">Pausada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Sucursales</Label>
            <Input type="number" min="1" value={form.locations} onChange={(event) => setField('locations', event.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={onSave} disabled={isPending || !form.businessName.trim() || !form.ownerEmail.trim()}>
            Guardar negocio
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
