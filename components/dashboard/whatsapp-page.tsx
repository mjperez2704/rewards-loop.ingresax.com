'use client'

import { useMemo, useState, useTransition } from 'react'
import { AlertCircle, MessageCircle, Send, Smartphone, Users } from 'lucide-react'
import { sendWhatsappCampaign } from '@/app/actions/whatsapp'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { DashboardPageHeader } from '@/components/dashboard/page-header'
import type { WhatsappData, WhatsappSegment } from '@/app/actions/whatsapp'

const segmentOptions: Array<{ value: WhatsappSegment; label: string }> = [
  { value: 'inactive', label: 'Clientes inactivos' },
  { value: 'vip', label: 'Clientes VIP' },
  { value: 'new', label: 'Nuevos clientes' },
  { value: 'all', label: 'Todos los clientes' },
]

function statusBadge(status: string) {
  if (status === 'sent') return 'status-success'
  if (status === 'failed') return 'border-destructive/20 bg-destructive/10 text-destructive'
  return 'status-warning'
}

function statusCopy(status: string) {
  if (status === 'sent') return 'Enviada'
  if (status === 'failed') return 'Fallida'
  return 'En cola'
}

export function WhatsAppPageClient({ initialData }: { initialData: WhatsappData }) {
  const [data, setData] = useState(initialData)
  const [segment, setSegment] = useState<WhatsappSegment>('inactive')
  const [message, setMessage] = useState('Hola {{nombre}}, te extrañamos. Vuelve esta semana y recibe 500 puntos extra en tu wallet INGRESAX REWARDS.')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const deliveryRate = useMemo(() => {
    const total = data.summary.sentMessages + data.summary.failedMessages
    return total > 0 ? Math.round((data.summary.sentMessages / total) * 100) : 0
  }, [data.summary.failedMessages, data.summary.sentMessages])

  const preview = message
    .replaceAll('{{nombre}}', 'Ana')
    .replaceAll('{{nivel}}', 'Oro')
    .replaceAll('{{puntos}}', '500')

  const submit = () => {
    setNotice('')
    setError('')
    startTransition(async () => {
      try {
        const nextData = await sendWhatsappCampaign({ segment, message })
        setData(nextData)
        setNotice('Campaña enviada a la audiencia elegible.')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudo enviar la campaña.')
      }
    })
  }

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="WhatsApp Marketing"
        title="WhatsApp Marketing"
        description="Campañas, segmentos, mensajes y resultados en un solo módulo."
        actions={(
          <Badge variant="outline" className={data.summary.integrationConfigured ? 'status-success' : 'status-warning'}>
            {data.summary.integrationConfigured ? 'Integración conectada' : 'Integración pendiente'}
          </Badge>
        )}
      />

      {(notice || error || !data.summary.integrationConfigured) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${error || !data.summary.integrationConfigured ? 'border-amber-500/25 bg-amber-500/10 text-amber-800' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700'}`}>
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>
              {error || notice || 'Configura WHATSAPP_ACCESS_TOKEN y WHATSAPP_PHONE_NUMBER_ID para enviar mensajes reales.'}
            </span>
          </div>
        </div>
      )}

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
            <select
              value={segment}
              onChange={(event) => setSegment(event.target.value as WhatsappSegment)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {segmentOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <Textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-36 rounded-lg"
            />
            <div className="rounded-lg border border-border/75 bg-background p-4">
              <p className="text-xs font-semibold uppercase text-muted-foreground">Vista previa</p>
              <p className="mt-2 text-sm leading-6">{preview}</p>
            </div>
            <Button
              onClick={submit}
              disabled={isPending || !message.trim() || !data.summary.integrationConfigured}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="size-4" />
              {isPending ? 'Enviando...' : 'Enviar campaña'}
            </Button>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, label: 'Audiencia disponible', value: data.summary.eligibleAudience.toLocaleString(), helper: `${data.summary.totalAudience.toLocaleString()} totales` },
            { icon: Send, label: 'Mensajes enviados', value: data.summary.sentMessages.toLocaleString(), helper: `${data.summary.failedMessages.toLocaleString()} fallidos` },
            { icon: Smartphone, label: 'Tasa de entrega', value: `${deliveryRate}%`, helper: `${data.summary.queuedMessages.toLocaleString()} en cola` },
          ].map((metric) => (
            <Card key={metric.label} className="premium-card p-5">
              <metric.icon className="size-5 text-brand-teal" />
              <p className="mt-4 text-sm text-muted-foreground">{metric.label}</p>
              <p className="mt-3 text-3xl font-semibold">{metric.value}</p>
              <p className="mt-2 text-xs font-semibold text-brand-teal">{metric.helper}</p>
            </Card>
          ))}
        </div>
      </div>

      <Card className="premium-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Campañas de WhatsApp</h2>
          <p className="text-sm text-muted-foreground">Rendimiento real por campaña</p>
        </div>
        <div className="divide-y divide-border">
          {data.campaigns.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">No hay campañas de WhatsApp enviadas todavía.</div>
          )}
          {data.campaigns.map((campaign) => (
            <div key={campaign.id} className="grid gap-3 p-5 md:grid-cols-4 md:items-center">
              <div>
                <p className="text-sm font-semibold">{campaign.name}</p>
                <p className="text-xs text-muted-foreground">{campaign.status}</p>
              </div>
              <p className="text-sm"><span className="font-semibold">{campaign.sent}</span> enviados</p>
              <p className="text-sm"><span className="font-semibold">{campaign.failed}</span> fallidos</p>
              <Badge variant="outline" className={campaign.failed > 0 ? 'status-warning' : 'status-brand'}>
                {campaign.failed > 0 ? 'Revisar' : campaign.status}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="premium-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Mensajes recientes</h2>
          <p className="text-sm text-muted-foreground">Últimos intentos registrados</p>
        </div>
        <div className="divide-y divide-border">
          {data.recentMessages.length === 0 && (
            <div className="p-6 text-sm text-muted-foreground">Aún no hay mensajes registrados.</div>
          )}
          {data.recentMessages.map((item) => (
            <div key={item.id} className="grid gap-3 p-5 md:grid-cols-[1fr_120px_120px] md:items-center">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{item.recipient}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.message}</p>
                {item.error && <p className="mt-1 text-xs text-destructive">{item.error}</p>}
              </div>
              <Badge variant="outline" className={statusBadge(item.status)}>
                {statusCopy(item.status)}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {new Date(item.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
