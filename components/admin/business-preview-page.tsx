import { BarChart3, Gift, MessageCircle, Star, Users, Wallet } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { AdminBusinessAccount } from '@/app/actions/admin-accounts'

export function AdminBusinessPreviewPage({ account }: { account?: AdminBusinessAccount }) {
  if (!account) {
    return (
      <div className="product-shell">
        <Card className="premium-card p-6">
          <p className="product-kicker">Vista muestra</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin cuenta para previsualizar</h2>
          <p className="mt-2 text-sm text-muted-foreground">La vista muestra se habilitará cuando exista al menos una cuenta real.</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <Card className="premium-card overflow-hidden">
            <div className="border-b border-border p-5">
              <p className="product-kicker">Vista muestra</p>
              <h2 className="mt-2 text-xl font-semibold tracking-normal">{account.businessName} Rewards</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Previsualizacion del panel de un negocio sin entrar al dashboard operativo real.
              </p>
            </div>
            <div className="p-5">
              <div className="rounded-lg border border-border bg-muted/35 p-5">
                <div className="flex items-center gap-4">
                  <Image
                    src="/logo_vertical_sf.png"
                    alt="INGRESAX"
                    width={56}
                    height={56}
                    className="size-14 object-contain"
                  />
                  <div>
                    <p className="text-lg font-semibold">{account.businessName}</p>
                    <p className="text-sm text-muted-foreground">Programa de lealtad · {account.plan}</p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  {[
                    ['Clientes', account.customers.toLocaleString(), Users],
                    ['Puntos activos', '0', Star],
                    ['Recompensas', account.rewardsIssued.toLocaleString(), Gift],
                    ['Wallets', '0', Wallet],
                  ].map(([label, value, Icon]) => (
                    <div key={label as string} className="rounded-lg border border-border bg-background p-4">
                      <Icon className="size-4 text-brand-teal" strokeWidth={1.5} />
                      <p className="mt-3 text-2xl font-semibold">{value as string}</p>
                      <p className="text-xs text-muted-foreground">{label as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          <Card className="premium-card p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="product-kicker">Campaña activa</p>
                <h2 className="mt-2 text-xl font-semibold tracking-normal">Sin campaña activa</h2>
              </div>
              <Badge variant="outline" className="status-success">Activa</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Las campañas activas aparecerán aquí cuando el negocio las cree.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline">
                <MessageCircle className="size-4" />
                Ver mensaje
              </Button>
              <Button variant="outline">
                <BarChart3 className="size-4" />
                Ver rendimiento
              </Button>
            </div>
          </Card>
        </div>

        <Card className="premium-card p-5">
          <p className="product-kicker">Flujo del cliente</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Tarjeta digital de muestra</h2>
          <div className="mt-6 rounded-lg border border-border bg-primary p-5 text-primary-foreground">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm opacity-75">{account.businessName}</p>
                <p className="mt-2 text-3xl font-semibold">0 pts</p>
              </div>
              <Badge className="bg-white/15 text-primary-foreground">Sin nivel</Badge>
            </div>
            <div className="mt-8 grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className={`h-10 rounded-md border border-white/25 ${index < 7 ? 'bg-white/90' : 'bg-white/10'}`}
                />
              ))}
            </div>
            <p className="mt-4 text-sm opacity-75">Sin wallet de cliente seleccionada.</p>
          </div>

          <div className="mt-6 space-y-3">
            {[
              ['Ultima visita', 'Sin registro'],
              ['Recompensa sugerida', 'Sin datos'],
              ['Automatizacion', 'Sin configurar'],
            ].map(([label, value]) => (
              <div key={label} className="premium-card-muted flex items-center justify-between p-4">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className="text-sm font-semibold">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  )
}
