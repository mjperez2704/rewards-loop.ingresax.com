import { BadgePercent, Gift, Repeat, ShoppingBag, TrendingUp, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'

interface Stats {
  totalClients: number
  activeClients?: number
  totalRewards: number
  activeCampaigns: number
  totalPoints: number
  rewardsIssued?: number
  rewardsRedeemed?: number
  attributedSales?: number
  returnRate?: number
}

export function StatsCards({ stats }: { stats: Stats }) {
  const totalClients = stats.totalClients
  const activeClients = stats.activeClients ?? 0
  const issuedRewards = stats.rewardsIssued ?? 0
  const redeemedRewards = stats.rewardsRedeemed ?? 0
  const attributedSales = stats.attributedSales ?? 0
  const returnRate = stats.returnRate ?? 0

  const cards = [
    {
      title: 'Total de clientes registrados',
      value: totalClients.toLocaleString(),
      change: 'Datos reales',
      icon: Users,
    },
    {
      title: 'Clientes activos',
      value: activeClients.toLocaleString(),
      change: 'Según estado actual',
      icon: Repeat,
    },
    {
      title: 'Recompensas emitidas',
      value: issuedRewards.toLocaleString(),
      change: 'Transacciones credit',
      icon: Gift,
    },
    {
      title: 'Recompensas canjeadas',
      value: redeemedRewards.toLocaleString(),
      change: 'Transacciones debit',
      icon: BadgePercent,
    },
    {
      title: 'Ventas atribuidas',
      value: `$${attributedSales.toLocaleString()}`,
      change: 'Registradas en wallet',
      icon: ShoppingBag,
    },
    {
      title: 'Tasa de retorno',
      value: `${returnRate}%`,
      change: 'Clientes activos / total',
      icon: TrendingUp,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map((card) => (
        <Card key={card.title} className="premium-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-4 text-3xl font-semibold tracking-normal">{card.value}</p>
            </div>
            <div className="premium-icon">
              <card.icon className="size-5" strokeWidth={1.5} />
            </div>
          </div>
          <p className="mt-4 text-xs font-semibold text-brand-success">{card.change}</p>
        </Card>
      ))}
    </div>
  )
}
