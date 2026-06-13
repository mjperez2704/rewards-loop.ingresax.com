import { Card } from '@/components/ui/card'

type MonthlyPoint = {
  month: string
  clients: number
  sales: number
}

function buildMonthlyData(clients: Array<{ createdAt: Date | string }>, transactions: Array<{ amount: number; type: string; createdAt: Date | string }>): MonthlyPoint[] {
  const formatter = new Intl.DateTimeFormat('es-MX', { month: 'short' })
  const now = new Date()

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    const month = formatter.format(date)
    const year = date.getFullYear()
    const monthIndex = date.getMonth()

    return {
      month,
      clients: clients.filter((client) => {
        const createdAt = new Date(client.createdAt)
        return createdAt.getFullYear() === year && createdAt.getMonth() === monthIndex
      }).length,
      sales: transactions
        .filter((tx) => {
          const createdAt = new Date(tx.createdAt)
          return tx.type === 'credit' && createdAt.getFullYear() === year && createdAt.getMonth() === monthIndex
        })
        .reduce((total, tx) => total + tx.amount, 0),
    }
  })
}

export function MonthlyGrowthChart({
  clients = [],
  transactions = [],
}: {
  clients?: Array<{ createdAt: Date | string }>
  transactions?: Array<{ amount: number; type: string; createdAt: Date | string }>
}) {
  const monthlyData = buildMonthlyData(clients, transactions)
  const maxClients = Math.max(...monthlyData.map((item) => item.clients), 1)
  const hasData = monthlyData.some((item) => item.clients > 0 || item.sales > 0)

  return (
    <Card className="premium-card p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Crecimiento mensual</h2>
          <p className="text-sm text-muted-foreground">Clientes registrados y ventas atribuidas</p>
        </div>
        <div className="rounded-full bg-brand-success-soft px-3 py-1 text-xs font-semibold text-brand-success">
          +34.2%
        </div>
      </div>

      {hasData ? (
        <div className="flex h-72 items-end gap-3">
        {monthlyData.map((item) => {
          const height = Math.max((item.clients / maxClients) * 100, 16)

          return (
            <div key={item.month} className="flex h-full flex-1 flex-col justify-end gap-3">
              <div className="flex flex-1 items-end">
                <div className="w-full rounded-lg bg-muted">
                  <div
                    className="flex min-h-12 items-start justify-center rounded-lg bg-primary px-1 pt-3 text-[10px] font-semibold text-primary-foreground"
                    style={{ height: `${height}%` }}
                  >
                    {item.clients.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold">{item.month}</p>
                <p className="text-[11px] text-muted-foreground">${Math.round(item.sales / 1000)}K</p>
              </div>
            </div>
          )
        })}
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border text-center">
          <div>
            <p className="font-semibold">Sin crecimiento registrado</p>
            <p className="mt-2 text-sm text-muted-foreground">El gráfico se llenará con clientes y ventas reales.</p>
          </div>
        </div>
      )}
    </Card>
  )
}
