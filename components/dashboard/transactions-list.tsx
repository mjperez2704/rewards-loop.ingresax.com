import { Card } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Transaction {
  id: string
  amount: number
  type: string
  description: string | null
  createdAt: Date
}

export function TransactionsList({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card className="premium-card overflow-hidden">
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold">Historial de Transacciones</h2>
      </div>
      {transactions.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-semibold">Sin transacciones</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Los puntos emitidos y canjeados aparecerán cuando existan movimientos reales.
          </p>
        </div>
      ) : (
      <div className="divide-y divide-border">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30">
            <div className="flex items-center gap-4">
              <div className={`flex size-10 items-center justify-center rounded-full ${
                tx.type === 'credit' ? 'bg-brand-success-soft' : 'bg-destructive/10'
              }`}>
                {tx.type === 'credit' ? (
                  <ArrowUpRight className="size-5 text-brand-success" />
                ) : (
                  <ArrowDownRight className="size-5 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">{tx.description || (tx.type === 'credit' ? 'Puntos añadidos' : 'Puntos canjeados')}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
            <p className={`text-sm font-semibold ${tx.type === 'credit' ? 'text-brand-success' : 'text-destructive'}`}>
              {tx.type === 'credit' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()} pts
            </p>
          </div>
        ))}
      </div>
      )}
    </Card>
  )
}
