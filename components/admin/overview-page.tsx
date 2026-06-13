import {
  BadgeDollarSign,
  Building2,
  ClipboardCheck,
  Database,
  LifeBuoy,
  MessageSquareText,
  Rocket,
  Users,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  getAdminSummary,
  money,
  planName,
  statusCopy,
} from '@/components/admin/admin-utils'
import type {
  AdminBusinessAccount,
  AdminFeedbackItem,
  AdminSupportTicket,
} from '@/app/actions/admin-accounts'

const riskCopy = {
  low: { label: 'Sano', className: 'status-success' },
  medium: { label: 'En observación', className: 'status-warning' },
  high: { label: 'En riesgo', className: 'border-destructive/20 bg-destructive/10 text-destructive' },
}

const activationSteps = [
  { title: 'Crear cuenta', description: 'Nombre del negocio, industria, dueño, plan y sucursal inicial.', status: '2 min' },
  { title: 'Activar módulos', description: 'Recompensas, wallet, QR, WhatsApp, referidos y operación POS.', status: '1 min' },
  { title: 'Publicar QR', description: 'QR para mostrador, mesas, recepción o link de WhatsApp.', status: 'Listo' },
  { title: 'Enviar explicación', description: 'Explicación corta con beneficios, métricas y primer caso de uso.', status: 'Automático' },
]

export function AdminOverviewPage({
  accounts,
  tickets,
  feedback,
}: {
  accounts: AdminBusinessAccount[]
  tickets: AdminSupportTicket[]
  feedback: AdminFeedbackItem[]
}) {
  const summary = getAdminSummary(accounts, tickets)
  const atRiskAccounts = accounts.filter((account) => account.health.risk !== 'low')
  const valueStory = [
    { title: 'Clientes finales', metric: summary.customers.toLocaleString(), description: 'Clientes registrados entre todas las cuentas SaaS.' },
    { title: 'MRR activo', metric: money(summary.mrr), description: 'Ingreso mensual recurrente de cuentas activas.' },
    { title: 'Tickets abiertos', metric: summary.openTickets.toLocaleString(), description: 'Preguntas, feedback o soporte pendientes de atender.' },
  ]

  return (
    <div className="product-shell">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
        {[
          { label: 'Cuentas totales', value: summary.accounts, helper: `${summary.activeAccounts} activas`, icon: Building2 },
          { label: 'MRR activo', value: money(summary.mrr), helper: 'Mensual recurrente', icon: BadgeDollarSign },
          { label: 'MRR impago', value: money(summary.unpaidMrr), helper: `${summary.pendingAccounts} cuenta pendiente`, icon: XCircle },
          { label: 'En trial', value: summary.trialAccounts, helper: 'Pendientes de conversión', icon: Rocket },
          { label: 'Clientes finales', value: summary.customers.toLocaleString(), helper: 'Entre cuentas SaaS', icon: Users },
          { label: 'Modulos activos', value: summary.enabledModules, helper: 'Microservicios habilitados', icon: Database },
          { label: 'Tickets abiertos', value: summary.openTickets, helper: `${summary.atRiskAccounts} clientes en riesgo`, icon: LifeBuoy },
        ].map((item) => (
          <Card key={item.label} className="premium-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-normal">{item.value}</p>
                <p className="mt-2 text-xs font-semibold text-brand-teal">{item.helper}</p>
              </div>
              <div className="premium-icon">
                <item.icon className="size-5" strokeWidth={1.5} />
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="premium-card p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="product-kicker">Activación rápida</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">Alta guiada de un negocio</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Flujo para dejar una cuenta lista con módulos, QR y explicación de valor en minutos.
              </p>
            </div>
            <Button>
              <Rocket className="size-4" />
              Activar negocio
            </Button>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {activationSteps.map((step) => (
              <div key={step.title} className="premium-card-muted p-4">
                <div className="flex items-start gap-3">
                  <div className="premium-icon-soft size-9">
                    <ClipboardCheck className="size-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{step.title}</p>
                      <Badge variant="outline" className="status-brand">{step.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-5">
          <p className="product-kicker">Valor en minutos</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Explicación para clientes nuevos</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {valueStory.map((item) => (
              <div key={item.title} className="premium-card-muted p-4">
                <p className="text-sm text-muted-foreground">{item.title}</p>
                <p className="mt-2 text-3xl font-semibold tracking-normal">{item.metric}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-border/75 bg-background p-4 text-sm leading-6 text-muted-foreground">
            IngresaX Loop ayuda a que cada negocio capture clientes, los haga volver, mida ventas atribuidas y convierta
            referidos en crecimiento real desde QR, wallet, recompensas y campañas.
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="premium-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="product-kicker">Actividad comercial</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Cuentas recientes</h2>
          </div>
          <div className="divide-y divide-border">
            {accounts.length === 0 && (
              <div className="p-5 text-sm text-muted-foreground">
                No hay cuentas SaaS registradas todavía.
              </div>
            )}
            {accounts.map((account) => (
              <div key={account.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{account.businessName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{account.ownerName} · {account.ownerEmail}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{planName(account.plan)}</Badge>
                  <Badge variant="outline" className={statusCopy[account.status].className}>
                    {statusCopy[account.status].label}
                  </Badge>
                  <span className="text-sm font-semibold">{money(account.mrr)}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-5">
          <p className="product-kicker">Riesgo y cobranza</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Clientes que necesitan atención</h2>
          <div className="mt-6 space-y-3">
            {atRiskAccounts.length === 0 && (
              <div className="premium-card-muted p-4">
                <p className="font-medium">Sin cuentas en riesgo</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  No hay pagos pendientes ni cuentas sin actividad crítica.
                </p>
              </div>
            )}
            {atRiskAccounts.map((account) => (
              <div key={account.id} className="premium-card-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{account.businessName}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Última actividad: {account.health.lastActivity} · Deuda: {money(account.billing.unpaidAmount)}
                    </p>
                  </div>
                  <Badge variant="outline" className={riskCopy[account.health.risk].className}>
                    {riskCopy[account.health.risk].label}
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {account.health.reasons.map((reason) => (
                    <Badge key={reason} variant="outline">{reason}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card className="premium-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="product-kicker">Tickets de clientes</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Preguntas, feedback y soporte</h2>
          </div>
          <div className="divide-y divide-border">
            {tickets.length === 0 && (
              <div className="p-5 text-sm text-muted-foreground">
                No hay tickets abiertos.
              </div>
            )}
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex flex-col gap-3 p-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{ticket.id}</Badge>
                    <Badge variant="outline" className={ticket.priority === 'Alta' ? 'border-destructive/20 bg-destructive/10 text-destructive' : 'status-muted'}>
                      {ticket.priority}
                    </Badge>
                    <Badge variant="outline" className="status-brand">{ticket.type}</Badge>
                  </div>
                  <p className="mt-2 font-medium">{ticket.subject}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ticket.account} · {ticket.age}</p>
                </div>
                <Button variant="outline" size="sm">
                  <LifeBuoy className="size-4" />
                  Atender
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-5">
          <p className="product-kicker">Feedback real</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Aprendizajes para iterar</h2>
          <div className="mt-6 space-y-3">
            {feedback.length === 0 && (
              <div className="premium-card-muted p-4">
                <p className="font-medium">Sin feedback registrado</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  El feedback real aparecerá aquí cuando se capture desde soporte o éxito del cliente.
                </p>
              </div>
            )}
            {feedback.map((item) => (
              <div key={item.id} className="premium-card-muted p-4">
                <div className="flex items-center gap-2">
                  <MessageSquareText className="size-4 text-brand-teal" strokeWidth={1.5} />
                  <p className="font-medium">{item.account}</p>
                  <Badge variant="outline" className="ml-auto">{item.tag}</Badge>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.quote}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
