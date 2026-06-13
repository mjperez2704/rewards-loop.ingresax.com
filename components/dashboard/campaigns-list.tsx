'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Megaphone, Trash2, Calendar, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { deleteCampaign } from '@/app/actions/dashboard'
import { useState } from 'react'

interface Campaign {
  id: string
  name: string
  description: string | null
  startDate: Date
  endDate: Date
  pointsMultiplier: number
  status: string
  createdAt: Date
}

export function CampaignsList({ campaigns }: { campaigns: Campaign[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteCampaign(id)
    setDeletingId(null)
  }

  const isActive = (campaign: Campaign) => {
    const now = new Date()
    return new Date(campaign.startDate) <= now && new Date(campaign.endDate) >= now
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Campañas recientes</h2>
        <p className="text-sm text-muted-foreground">Activas y programadas</p>
      </div>
      {campaigns.length === 0 && (
        <Card className="premium-card p-6 text-center">
          <p className="font-semibold">Sin campañas creadas</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea una campaña para medir audiencia, fechas, multiplicador y rendimiento real.
          </p>
        </Card>
      )}
      {campaigns.map((campaign) => {
        const active = isActive(campaign)
        
        return (
          <Card key={campaign.id} className="premium-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`flex size-12 items-center justify-center rounded-lg ${active ? 'bg-brand-teal-soft' : 'bg-muted'}`}>
                  <Megaphone className={`size-6 ${active ? 'text-brand-teal' : 'text-muted-foreground'}`} strokeWidth={1.5} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{campaign.name}</h3>
                    <Badge variant="outline" className={active ? 'status-success' : 'status-warning'}>
                      {active ? 'Activa' : 'Programada'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {campaign.description || 'Sin descripción'}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - {new Date(campaign.endDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="size-4 text-brand-gold" />
                      <span className="font-medium text-foreground">{campaign.pointsMultiplier}x puntos</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(campaign.id)}
                disabled={deletingId === campaign.id}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
