import { BarChart3, Download, Repeat, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { getClients, getDashboardStats, getTransactions } from '@/app/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

function buildMonthlySales(transactions: Array<{ amount: number; type: string; createdAt: Date | string }>) {
  const formatter = new Intl.DateTimeFormat('es-MX', { month: 'short' })
  const now = new Date()

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const sales = transactions
      .filter((tx) => {
        const createdAt = new Date(tx.createdAt)
        return tx.type === 'credit' && createdAt.getFullYear() === date.getFullYear() && createdAt.getMonth() === date.getMonth()
      })
      .reduce((total, tx) => total + tx.amount, 0)

    return { month: formatter.format(date), sales }
  })
}

export default async function ReportsPage() {
  const [stats, clients, transactions] = await Promise.all([
    getDashboardStats(),
    getClients(),
    getTransactions(),
  ])
  const monthlySales = buildMonthlySales(transactions)
  const maxSales = Math.max(...monthlySales.map((item) => item.sales), 1)

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Reportes"
        title="Reportes ejecutivos"
        description="Retención, ventas atribuidas, canjes y crecimiento mensual."
        actions={
        <Button variant="outline" className="bg-background">
          <Download className="size-4" />
          Exportar reporte
        </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { icon: Users, label: 'Clientes nuevos', value: clients.length.toLocaleString() },
          { icon: Repeat, label: 'Tasa de retorno', value: `${stats.returnRate}%` },
          { icon: ShoppingBag, label: 'Ventas atribuidas', value: `$${stats.attributedSales.toLocaleString()}` },
          { icon: TrendingUp, label: 'Crecimiento', value: `${stats.totalClients > 0 ? 'Activo' : 'Sin datos'}` },
        ].map((metric) => (
          <Card key={metric.label} className="premium-card p-5">
            <metric.icon className="size-5 text-brand-teal" />
            <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
            <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
          </Card>
        ))}
      </div>

      <Card className="premium-card p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Ventas atribuidas por mes</h2>
            <p className="text-sm text-muted-foreground">Comparativo mensual de ventas vinculadas al programa</p>
          </div>
          <BarChart3 className="size-6 text-brand-teal" />
        </div>
        <div className="space-y-4">
          {monthlySales.map((month) => (
            <div key={month.month} className="grid gap-3 md:grid-cols-[64px_1fr_96px] md:items-center">
              <p className="text-sm font-semibold">{month.month}</p>
              <div className="h-3 rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${(month.sales / maxSales) * 100}%` }} />
              </div>
              <p className="text-sm font-semibold">${month.sales.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
