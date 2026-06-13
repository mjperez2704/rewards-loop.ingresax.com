'use client'

import { useMemo, useState, useTransition } from 'react'
import { CheckCircle2, Pencil, Save, Trash2 } from 'lucide-react'
import {
  deleteServicePlan,
  updateAccountSubscription,
  upsertServicePlan,
} from '@/app/actions/admin-plans'
import type { ServicePlanRecord } from '@/app/actions/admin-plans'
import type { AdminBusinessAccount } from '@/app/actions/admin-accounts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { money, planName, statusCopy } from '@/components/admin/admin-utils'
import { SERVICE_MODULES } from '@/lib/service-modules'
import type { ServiceModuleKey, SubscriptionStatus } from '@/lib/service-modules'

type PlanForm = {
  id: string
  name: string
  priceMonthly: string
  currency: string
  description: string
  includedModules: ServiceModuleKey[]
  customerLimit: string
  campaignLimit: string
  whatsappLimit: string
  userLimit: string
  status: string
}

function emptyPlan(): PlanForm {
  return {
    id: '',
    name: '',
    priceMonthly: '0',
    currency: 'USD',
    description: '',
    includedModules: SERVICE_MODULES.map((module) => module.key),
    customerLimit: '1000',
    campaignLimit: '5',
    whatsappLimit: '5000',
    userLimit: '3',
    status: 'active',
  }
}

function toForm(plan: ServicePlanRecord): PlanForm {
  return {
    id: plan.id,
    name: plan.name,
    priceMonthly: String(plan.priceMonthly),
    currency: plan.currency,
    description: plan.description ?? '',
    includedModules: plan.includedModules,
    customerLimit: String(plan.customerLimit),
    campaignLimit: String(plan.campaignLimit),
    whatsappLimit: String(plan.whatsappLimit),
    userLimit: String(plan.userLimit),
    status: plan.status,
  }
}

export function AdminPlansPage({
  accounts: initialAccounts,
  initialPlans,
}: {
  accounts: AdminBusinessAccount[]
  initialPlans: ServicePlanRecord[]
}) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [plans, setPlans] = useState(initialPlans)
  const [selectedAccountId, setSelectedAccountId] = useState(initialAccounts[0]?.id ?? '')
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlans[0]?.id ?? '')
  const [selectedStatus, setSelectedStatus] = useState<SubscriptionStatus>('active')
  const [form, setForm] = useState<PlanForm>(() => emptyPlan())
  const [isPending, startTransition] = useTransition()

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId) ?? accounts[0]
  const selectedAccountPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedAccount?.plan),
    [plans, selectedAccount?.plan],
  )

  const setField = (key: keyof PlanForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const toggleModule = (key: ServiceModuleKey, checked: boolean) => {
    setForm((current) => ({
      ...current,
      includedModules: checked
        ? Array.from(new Set([...current.includedModules, key]))
        : current.includedModules.filter((item) => item !== key),
    }))
  }

  const savePlan = () => {
    startTransition(async () => {
      setPlans(await upsertServicePlan({
        id: form.id || undefined,
        name: form.name,
        priceMonthly: Number(form.priceMonthly),
        currency: form.currency,
        description: form.description,
        includedModules: form.includedModules,
        customerLimit: Number(form.customerLimit),
        campaignLimit: Number(form.campaignLimit),
        whatsappLimit: Number(form.whatsappLimit),
        userLimit: Number(form.userLimit),
        status: form.status,
      }))
      setForm(emptyPlan())
    })
  }

  const removePlan = (planId: string) => {
    startTransition(async () => {
      setPlans(await deleteServicePlan(planId))
    })
  }

  const applyPlan = () => {
    if (!selectedAccount || !selectedPlanId) return

    startTransition(async () => {
      setAccounts(await updateAccountSubscription({
        accountId: selectedAccount.id,
        planId: selectedPlanId,
        status: selectedStatus,
      }))
    })
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">CRUD de planes</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Catálogo comercial</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Configura nombre, precio, límites y microservicios incluidos por plan.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">ID interno</label>
              <Input value={form.id} onChange={(event) => setField('id', event.target.value)} className="mt-2" placeholder="Growth" />
            </div>
            <div>
              <label className="text-sm font-medium">Nombre visible</label>
              <Input value={form.name} onChange={(event) => setField('name', event.target.value)} className="mt-2" placeholder="Crecimiento" />
            </div>
            <div>
              <label className="text-sm font-medium">Precio mensual</label>
              <Input value={form.priceMonthly} onChange={(event) => setField('priceMonthly', event.target.value)} className="mt-2" type="number" min="0" />
            </div>
            <div>
              <label className="text-sm font-medium">Moneda</label>
              <Input value={form.currency} onChange={(event) => setField('currency', event.target.value)} className="mt-2" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea value={form.description} onChange={(event) => setField('description', event.target.value)} className="mt-2" />
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            {[
              ['Clientes', 'customerLimit'],
              ['Campañas', 'campaignLimit'],
              ['WhatsApp', 'whatsappLimit'],
              ['Usuarios', 'userLimit'],
            ].map(([label, key]) => (
              <div key={key}>
                <label className="text-sm font-medium">{label}</label>
                <Input
                  value={form[key as keyof PlanForm] as string}
                  onChange={(event) => setField(key as keyof PlanForm, event.target.value)}
                  className="mt-2"
                  type="number"
                  min="0"
                />
              </div>
            ))}
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium">Microservicios incluidos</label>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {SERVICE_MODULES.map((module) => (
                <label key={module.key} className="flex items-center gap-2 rounded-lg border border-border/70 bg-background p-3 text-sm">
                  <Checkbox
                    checked={form.includedModules.includes(module.key)}
                    disabled={module.key === 'dashboard'}
                    onCheckedChange={(checked) => toggleModule(module.key, checked === true)}
                  />
                  <span>{module.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-5 flex gap-2">
            <Button onClick={savePlan} disabled={isPending || !form.name.trim()} className="flex-1">
              <Save className="size-4" />
              Guardar plan
            </Button>
            <Button variant="outline" onClick={() => setForm(emptyPlan())} disabled={isPending}>
              Nuevo
            </Button>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="premium-card p-5">
            <p className="product-kicker">Asignación</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Cambiar plan de una cuenta</h2>
            {selectedAccount ? (
              <div className="mt-5 grid gap-3 md:grid-cols-[1fr_180px_160px_auto] md:items-end">
                <div>
                  <label className="text-sm font-medium">Cuenta</label>
                  <Select value={selectedAccountId} onValueChange={setSelectedAccountId}>
                    <SelectTrigger className="mt-2 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>{account.businessName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Plan</label>
                  <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger className="mt-2 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.filter((plan) => plan.status !== 'archived').map((plan) => (
                        <SelectItem key={plan.id} value={plan.id}>{plan.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Estado</label>
                  <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as SubscriptionStatus)}>
                    <SelectTrigger className="mt-2 bg-background">
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
                <Button onClick={applyPlan} disabled={isPending || !selectedPlanId}>Aplicar</Button>
              </div>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No hay cuentas de negocio para asignar planes.</p>
            )}

            {selectedAccount && (
              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                {[
                  ['Plan actual', planName(selectedAccount.plan)],
                  ['Estado', statusCopy[selectedAccount.status].label],
                  ['MRR', money(selectedAccount.mrr)],
                  ['Módulos', selectedAccountPlan?.includedModules.length ?? 0],
                ].map(([label, value]) => (
                  <div key={label} className="premium-card-muted p-4">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 font-semibold">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((plan) => (
              <Card key={plan.id} className="premium-card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-lg font-semibold">{plan.name}</p>
                      <Badge variant="outline" className={plan.status === 'active' ? 'status-success' : 'status-muted'}>
                        {plan.status === 'active' ? 'Activo' : 'Archivado'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{plan.description || 'Sin descripción'}</p>
                    <p className="mt-3 text-2xl font-semibold">{plan.currency} {plan.priceMonthly}<span className="text-sm font-normal text-muted-foreground"> / mes</span></p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon-sm" onClick={() => setForm(toForm(plan))}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon-sm" onClick={() => removePlan(plan.id)} disabled={isPending}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  {[
                    ['Clientes', plan.customerLimit],
                    ['Campañas', plan.campaignLimit],
                    ['WhatsApp', plan.whatsappLimit],
                    ['Usuarios', plan.userLimit],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-border/70 bg-muted/25 px-3 py-2">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="float-right font-semibold">{Number(value).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2">
                  {SERVICE_MODULES.filter((module) => plan.includedModules.includes(module.key)).map((module) => (
                    <p key={module.key} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-brand-teal" />
                      {module.name}
                    </p>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
