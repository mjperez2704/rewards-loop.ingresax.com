import { Card } from '@/components/ui/card'
import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react'

export function WalletOverview({ totalBalance, walletsCount }: { totalBalance: number; walletsCount: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card className="relative overflow-hidden rounded-lg border border-primary/10 bg-primary p-8 text-primary-foreground sm:col-span-2">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-white/5" />
        <div className="relative">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
              <Wallet className="size-5" />
            </div>
            <span className="text-sm font-medium opacity-80">Balance Total</span>
          </div>
          <p className="mb-2 text-5xl font-semibold tracking-normal">{totalBalance.toLocaleString()}</p>
          <p className="text-sm opacity-60">puntos disponibles</p>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="premium-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Billeteras Activas</span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
              <TrendingUp className="size-4" />
            </div>
          </div>
          <p className="text-2xl font-semibold">{walletsCount}</p>
        </Card>
        <Card className="premium-card p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Este Mes</span>
            <div className="flex items-center gap-1 text-brand-success">
              <ArrowUpRight className="size-4" />
              <span className="text-xs font-medium">Real</span>
            </div>
          </div>
          <p className="text-2xl font-semibold">0</p>
        </Card>
      </div>
    </div>
  )
}
