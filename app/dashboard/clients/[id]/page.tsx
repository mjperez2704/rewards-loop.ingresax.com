import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Gift, History, MessageCircle, QrCode, Share2, ShoppingBag, Star, Trophy, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import { getClientById } from '@/app/actions/dashboard'

export default async function ClientProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dbClient = await getClientById(id)
  if (!dbClient) notFound()

  const client = {
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    phone: dbClient.phone || 'Sin teléfono',
    whatsapp: dbClient.phone || '',
    status: dbClient.status,
    loyaltyTier: dbClient.loyaltyTier,
    totalPoints: dbClient.totalPoints,
    lastVisit: dbClient.updatedAt.toISOString(),
    createdAt: dbClient.createdAt.toISOString(),
  }
  const whatsappNumber = client.whatsapp.replace(/\D/g, '')
  const progress = Math.min(Math.round((client.totalPoints / 15000) * 100), 100)

  return (
    <div className="product-shell">
      <Button asChild variant="ghost" size="sm" className="w-fit px-0 text-muted-foreground hover:bg-transparent">
        <Link href="/dashboard/clients">
          <ArrowLeft className="size-4" />
          Volver a clientes
        </Link>
      </Button>
      <DashboardPageHeader
        eyebrow="Perfil de cliente"
        title={client.name}
        description="Datos, puntos, compras, recompensas, canjes y referidos."
        actions={
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={!whatsappNumber}>
          <a href={whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#'} target="_blank" rel="noreferrer">
            <MessageCircle className="size-4" />
            Enviar mensaje por WhatsApp
          </a>
        </Button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.86fr_1.14fr]">
        <div className="space-y-6">
          <Card className="premium-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="size-6" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold">{client.name}</h2>
                  <Badge variant="outline" className="status-brand">{client.loyaltyTier}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{client.email}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                ['Visitas', 0],
                ['Referidos', 0],
                ['Gasto total', '$0'],
                ['Ultima visita', new Date(client.lastVisit).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })],
              ].map(([label, value]) => (
                <div key={label} className="premium-card-muted p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 text-lg font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="overflow-hidden rounded-lg border border-primary/10 bg-primary p-6 text-primary-foreground shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-white/55">Puntos disponibles</p>
                <p className="mt-2 text-5xl font-semibold tracking-normal">{client.totalPoints.toLocaleString()}</p>
              </div>
              <Star className="size-8 text-brand-gold" />
            </div>
            <div className="mt-8">
              <div className="flex justify-between text-xs">
                <span>Progreso a siguiente nivel</span>
                <span>{progress}%</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/12">
                <div className="h-full rounded-full bg-brand-gold" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm font-semibold">Wallet digital activa</p>
                <p className="text-xs text-white/50">Listo para Wallet</p>
              </div>
              <QrCode className="size-8" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="premium-card shadow-sm">
            <div className="border-b border-border p-5">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <History className="size-5" />
                Historial de compras
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-3 font-medium">Fecha</th>
                    <th className="px-5 py-3 font-medium">Compra</th>
                    <th className="px-5 py-3 font-medium">Monto</th>
                    <th className="px-5 py-3 font-medium">Puntos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-muted-foreground">
                      Sin compras registradas.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="premium-card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <Gift className="size-4" />
                Recompensas ganadas
              </h3>
              <div className="mt-4 space-y-3">
                <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">Sin recompensas ganadas.</p>
              </div>
            </Card>

            <Card className="premium-card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <Trophy className="size-4" />
                Recompensas canjeadas
              </h3>
              <div className="mt-4 space-y-3">
                <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">Sin recompensas canjeadas.</p>
              </div>
            </Card>

            <Card className="premium-card p-5">
              <h3 className="flex items-center gap-2 font-semibold">
                <Share2 className="size-4" />
                Referidos
              </h3>
              <div className="mt-4 space-y-3">
                <p className="rounded-lg bg-muted/40 p-3 text-sm text-muted-foreground">Sin referidos registrados.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Card className="premium-card p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <ShoppingBag className="size-5" />
          Siguiente mejor acción
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Usa los datos reales de puntos, actividad y compras para definir la siguiente acción comercial.
        </p>
      </Card>
    </div>
  )
}
