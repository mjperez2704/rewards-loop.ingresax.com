import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Client {
  id: string
  name: string
  email: string
  totalPoints: number
  loyaltyTier: string
  createdAt: Date
}

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: Date
}

const statusStyles: Record<string, string> = {
  Canjeada: 'status-brand',
  Venta: 'status-success',
  Nivel: 'status-warning',
  Referido: 'status-brand',
  Enviada: 'status-muted',
}

export function RecentActivity({
  clients,
  transactions,
}: {
  clients: Client[]
  transactions: Transaction[]
}) {
  const liveActivity = [
    ...clients.map((client) => ({
      client: client.name,
      event: `Nuevo cliente nivel ${client.loyaltyTier}`,
      channel: 'Dashboard',
      value: `${client.totalPoints.toLocaleString()} pts`,
      status: 'Nivel',
      date: new Date(client.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    })),
    ...transactions.map((tx) => ({
      client: tx.description || 'Transaccion de puntos',
      event: tx.type === 'credit' ? 'Puntos acreditados' : 'Recompensa canjeada',
      channel: 'Wallet',
      value: `${tx.type === 'credit' ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()} pts`,
      status: tx.type === 'credit' ? 'Venta' : 'Canjeada',
      date: new Date(tx.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }),
    })),
  ]

  const activity = liveActivity.slice(0, 8)

  return (
    <Card className="premium-card overflow-hidden">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold">Tabla de actividad reciente</h2>
        <p className="text-sm text-muted-foreground">Ventas, puntos, canjes y mensajes</p>
      </div>
      <div className="overflow-x-auto">
        {activity.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">Sin actividad reciente</p>
            <p className="mt-2 text-sm text-muted-foreground">
              La actividad aparecerá cuando registres clientes, transacciones o canjes reales.
            </p>
          </div>
        ) : (
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Cliente</th>
              <th className="px-5 py-3 font-medium">Actividad</th>
              <th className="px-5 py-3 font-medium">Canal</th>
              <th className="px-5 py-3 font-medium">Valor</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activity.map((item) => (
              <tr key={`${item.client}-${item.event}`} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4">
                  <p className="text-sm font-semibold">{item.client}</p>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.event}</td>
                <td className="px-5 py-4 text-sm">{item.channel}</td>
                <td className="px-5 py-4 text-sm font-semibold">{item.value}</td>
                <td className="px-5 py-4">
                  <Badge variant="outline" className={statusStyles[item.status] || 'border-border bg-muted text-muted-foreground'}>
                    {item.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </Card>
  )
}
