import Link from 'next/link'
import { BarChart3, Gift, Megaphone, MessageCircle, Plus, Users, Wallet } from 'lucide-react'
import { Card } from '@/components/ui/card'

export function QuickActions() {
  const actions = [
    {
      title: 'Agregar cliente',
      description: 'Registra WhatsApp, email y nivel',
      href: '/dashboard/clients',
      icon: Users,
    },
    {
      title: 'Crear recompensa',
      description: 'Configura puntos, cupón o cashback',
      href: '/dashboard/rewards',
      icon: Gift,
    },
    {
      title: 'Lanzar campaña',
      description: 'Segmento, mensaje y recompensa',
      href: '/dashboard/campaigns',
      icon: Megaphone,
    },
    {
      title: 'Enviar WhatsApp',
      description: 'Mensaje para clientes activos',
      href: '/dashboard/whatsapp',
      icon: MessageCircle,
    },
    {
      title: 'Emitir wallet',
      description: 'Tarjeta digital con QR',
      href: '/dashboard/wallet',
      icon: Wallet,
    },
    {
      title: 'Ver reportes',
      description: 'Ventas, retorno y canjes',
      href: '/dashboard/reports',
      icon: BarChart3,
    },
  ]

  return (
    <Card className="premium-card p-6">
      <h2 className="text-lg font-semibold">Acciones rápidas</h2>
      <p className="mb-5 text-sm text-muted-foreground">Operaciones frecuentes del negocio</p>

      <div className="space-y-2">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="group flex items-center gap-4 rounded-lg p-3 transition-colors hover:bg-muted">
              <div className="premium-icon-soft transition-colors group-hover:bg-background">
                <action.icon className="size-5" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{action.title}</p>
                <p className="truncate text-xs text-muted-foreground">{action.description}</p>
              </div>
              <Plus className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </Card>
  )
}
