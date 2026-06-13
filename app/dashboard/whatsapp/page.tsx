import { MessageCircle, Send, Smartphone, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

const messages = [
  { name: 'Clientes inactivos', sent: '842', open: '76%', status: 'Enviada' },
  { name: 'Cupón VIP', sent: '1,284', open: '81%', status: 'Activa' },
  { name: 'Cumpleaños junio', sent: '86', open: '89%', status: 'Programada' },
]

export default function WhatsAppPage() {
  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="WhatsApp Marketing"
        title="WhatsApp Marketing"
        description="Campañas, segmentos, mensajes y resultados en un solo módulo."
        actions={<Badge variant="outline" className="status-success">Integración conectada</Badge>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="premium-card p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold">Compositor rápido</h2>
              <p className="text-sm text-muted-foreground">Mensaje por segmento</p>
            </div>
            <MessageCircle className="size-6 text-brand-success" />
          </div>
          <div className="space-y-4">
            <select className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm">
              <option>Clientes inactivos</option>
              <option>Clientes VIP</option>
              <option>Nuevos clientes</option>
              <option>Todos los clientes</option>
            </select>
            <Textarea
              defaultValue="Hola {{nombre}}, te extrañamos. Vuelve esta semana y recibe 500 puntos extra en tu wallet INGRESAX REWARDS."
              className="min-h-36 rounded-lg"
            />
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Send className="size-4" />
              Enviar campaña
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, label: 'Audiencia disponible', value: '2,847' },
            { icon: Send, label: 'Mensajes enviados', value: '18,420' },
            { icon: Smartphone, label: 'Tasa de apertura', value: '81%' },
          ].map((metric) => (
            <Card key={metric.label} className="premium-card p-5">
              <metric.icon className="size-5 text-brand-teal" />
              <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="premium-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Campañas de WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Rendimiento por mensaje</p>
        </div>
        <div className="divide-y divide-border">
          {messages.map((message) => (
            <div key={message.name} className="grid gap-3 p-5 md:grid-cols-4 md:items-center">
              <div>
                <p className="text-sm font-semibold">{message.name}</p>
                <p className="text-xs text-muted-foreground">Plantilla aprobada</p>
              </div>
              <p className="text-sm"><span className="font-semibold">{message.sent}</span> enviados</p>
              <p className="text-sm"><span className="font-semibold">{message.open}</span> apertura</p>
              <Badge variant="outline" className="status-brand">{message.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
