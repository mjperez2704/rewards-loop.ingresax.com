import Link from 'next/link'
import { Gift, Megaphone, Send, Share2 } from 'lucide-react'
import { getDashboardStats, getClients, getTransactions } from '@/app/actions/dashboard'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { MonthlyGrowthChart } from '@/components/dashboard/monthly-growth-chart'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default async function DashboardPage() {
  const [stats, clients, transactions] = await Promise.all([
    getDashboardStats(),
    getClients(),
    getTransactions(),
  ])
  const returnRate = stats.returnRate || 0
  const attributedSales = stats.attributedSales || 0
  const ownerGrowthQuestions = [
    { question: '¿Cuántos clientes tengo?', answer: stats.totalClients.toLocaleString(), helper: 'Clientes registrados' },
    { question: '¿Cuántos volvieron?', answer: (stats.activeClients ?? 0).toLocaleString(), helper: `${returnRate}% de retorno` },
    { question: '¿Cuánto generó el programa?', answer: `$${attributedSales.toLocaleString()}`, helper: 'Ventas atribuidas registradas' },
    { question: '¿Qué campaña funcionó?', answer: stats.activeCampaigns > 0 ? `${stats.activeCampaigns} activas` : 'Sin campañas', helper: 'Crea campañas para medir rendimiento' },
    { question: '¿Qué recompensas funcionan?', answer: stats.rewardsRedeemed ? `${stats.rewardsRedeemed} canjes` : 'Sin canjes', helper: 'Los canjes aparecerán aquí' },
    { question: '¿Cuántos referidos llegaron?', answer: '0', helper: 'Pendiente de conectar referidos reales' },
  ]

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Panel principal"
        title="Resumen principal"
        description="Clientes, recompensas, ventas atribuidas y retorno en tiempo real."
        actions={
          <div className="premium-card px-4 py-3 text-sm">
          <span className="text-muted-foreground">Sucursal activa:</span>
          <span className="ml-2 font-semibold">Matriz Roma Norte</span>
          </div>
        }
      />

      <StatsCards stats={stats} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {ownerGrowthQuestions.map((item) => (
          <Card key={item.question} className="premium-card p-5">
            <p className="text-sm font-medium text-muted-foreground">{item.question}</p>
            <p className="mt-3 text-2xl font-semibold tracking-normal">{item.answer}</p>
            <p className="mt-2 text-xs font-semibold text-brand-success">{item.helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="premium-card p-5">
          <div className="flex items-start gap-4">
            <div className="premium-icon">
              <Megaphone className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold">Enviar promoción</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Elige segmento, recompensa y canal para activar una campaña rápida.</p>
              <Button asChild className="mt-4" size="sm">
                <Link href="/dashboard/campaigns">
                  <Send className="size-4" />
                  Crear campaña
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="premium-card p-5">
          <div className="flex items-start gap-4">
            <div className="premium-icon">
              <Gift className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <p className="font-semibold">Recompensas que funcionan</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Cupón 15% OFF, cashback y sellos digitales concentran los canjes.</p>
              <Button asChild className="mt-4" size="sm" variant="outline">
                <Link href="/dashboard/rewards">Gestionar recompensas</Link>
              </Button>
            </div>
          </div>
        </Card>

        <Card className="premium-card p-5">
          <div className="flex items-start gap-4">
            <div className="premium-icon">
              <Share2 className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">Referidos</p>
                <Badge variant="outline" className="status-brand">0 nuevos</Badge>
              </div>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Invitaciones con recompensa para cliente actual y cliente nuevo.</p>
              <Button asChild className="mt-4" size="sm" variant="outline">
                <Link href="/dashboard/referrals">Ver referidos</Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <MonthlyGrowthChart clients={clients} transactions={transactions} />
          <RecentActivity clients={clients.slice(0, 5)} transactions={transactions.slice(0, 5)} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
