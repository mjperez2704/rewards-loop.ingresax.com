'use client'

import { useMemo, useState } from 'react'
import { CalendarDays, Gift, MessageCircle, Send, Users } from 'lucide-react'
import { createCampaign } from '@/app/actions/dashboard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

const campaignTypes = ['Puntos dobles', 'Cupón', 'Reactivación', 'Cumpleaños', 'Referidos', 'Membresía VIP']
const segments = ['Todos los clientes', 'Clientes inactivos', 'Nivel Oro', 'Nivel Platino', 'Nuevos clientes', 'Clientes VIP']
const rewards = ['Cupón 15% OFF', '500 puntos extra', 'Cashback $100', 'Sello doble', 'Upgrade VIP', 'Regalo de cumpleaños']

export function CampaignBuilder() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [name, setName] = useState('Semana VIP de recompensas')
  const [type, setType] = useState(campaignTypes[1])
  const [segment, setSegment] = useState(segments[2])
  const [message, setMessage] = useState('Hola {{nombre}}, tienes un beneficio exclusivo: {{recompensa}}. Usa tu wallet antes del {{fecha_fin}} y suma más puntos.')
  const [startDate, setStartDate] = useState('2026-06-05')
  const [endDate, setEndDate] = useState('2026-06-12')
  const [reward, setReward] = useState(rewards[0])

  const preview = useMemo(() => {
    return message
      .replace('{{nombre}}', 'Ana')
      .replace('{{recompensa}}', reward)
      .replace('{{fecha_fin}}', new Date(`${endDate}T12:00:00`).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' }))
  }, [endDate, message, reward])

  const handleSave = async () => {
    setLoading(true)
    setStatus('')

    try {
      const multiplier = type === 'Puntos dobles' ? 2 : type === 'Referidos' ? 1.5 : 1

      await createCampaign({
        name,
        description: [
          `Tipo: ${type}`,
          `Segmento: ${segment}`,
          `Recompensa: ${reward}`,
          `Mensaje WhatsApp: ${message}`,
        ].join('\n'),
        startDate: new Date(`${startDate}T12:00:00`),
        endDate: new Date(`${endDate}T12:00:00`),
        pointsMultiplier: multiplier,
      })

      setStatus('Campaña guardada correctamente.')
    } catch {
      setStatus('No se pudo guardar la campaña. Revisa la conexión y vuelve a intentar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className="premium-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Creador de campaña</h2>
          <p className="text-sm text-muted-foreground">WhatsApp, segmento, fechas y recompensa</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="campaign-name">Nombre de campaña</Label>
            <Input id="campaign-name" value={name} onChange={(event) => setName(event.target.value)} className="rounded-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-type">Tipo de campaña</Label>
            <select
              id="campaign-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {campaignTypes.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-segment">Segmento de clientes</Label>
            <select
              id="campaign-segment"
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {segments.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-start">Fecha de inicio</Label>
            <Input id="campaign-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="rounded-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-end">Fecha de finalización</Label>
            <Input id="campaign-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="rounded-lg" />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="campaign-reward">Recompensa asociada</Label>
            <select
              id="campaign-reward"
              value={reward}
              onChange={(event) => setReward(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
            >
              {rewards.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="campaign-message">Mensaje de WhatsApp</Label>
            <Textarea
              id="campaign-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="min-h-28 rounded-lg"
            />
          </div>
        </div>
      </Card>

      <Card className="premium-card p-6">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold">Vista previa del mensaje</h2>
            <p className="text-sm text-muted-foreground">Mensaje listo para revisar antes del envío</p>
          </div>
          <MessageCircle className="size-6 text-brand-success" />
        </div>

        <div className="rounded-lg bg-brand-success-soft p-4">
          <div className="ml-auto max-w-sm rounded-lg bg-white p-4 shadow-sm">
            <p className="text-sm leading-6 text-black/75">{preview}</p>
            <p className="mt-3 text-right text-[11px] text-black/38">10:42 AM</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          {[
            { icon: Users, label: 'Segmento', value: segment },
            { icon: Gift, label: 'Recompensa', value: reward },
            { icon: CalendarDays, label: 'Vigencia', value: `${startDate} / ${endDate}` },
            { icon: Send, label: 'Envio estimado', value: '1,284 mensajes' },
          ].map((item) => (
            <div key={item.label} className="premium-card-muted p-3">
              <item.icon className="size-4 text-muted-foreground" />
              <p className="mt-2 text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {status && (
          <p className={status.startsWith('Campaña') ? 'mt-5 text-sm font-medium text-brand-success' : 'mt-5 text-sm font-medium text-destructive'}>
            {status}
          </p>
        )}

        <Button onClick={handleSave} disabled={loading} className="mt-6 w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {loading ? 'Guardando campaña...' : 'Guardar campaña'}
        </Button>
      </Card>
    </div>
  )
}
