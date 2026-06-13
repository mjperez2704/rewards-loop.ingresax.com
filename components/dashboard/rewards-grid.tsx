'use client'

import { useState } from 'react'
import { Gift, Trash2 } from 'lucide-react'
import { deleteReward } from '@/app/actions/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Reward {
  id: string
  title: string
  description: string | null
  pointsRequired: number
  category: string
  status: string
  createdAt: Date
}

export function RewardsGrid({ rewards }: { rewards: Reward[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteReward(id)
    setDeletingId(null)
  }

  if (rewards.length === 0) {
    return (
      <Card className="premium-card p-8 text-center">
        <p className="font-semibold">Sin recompensas creadas</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Crea la primera recompensa para empezar a emitir puntos, cupones o beneficios reales.
        </p>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {rewards.map((reward) => (
        <Card key={reward.id} className="premium-card p-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="premium-icon">
              <Gift className="size-5" strokeWidth={1.5} />
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(reward.id)}
              disabled={deletingId === reward.id}
              className="rounded-lg text-destructive hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
          <h3 className="font-semibold">{reward.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{reward.description || 'Sin descripción'}</p>
          <div className="mt-5 flex items-center justify-between">
            <Badge variant="outline" className="status-brand">{reward.category}</Badge>
            <span className="text-sm font-semibold">{reward.pointsRequired.toLocaleString()} pts</span>
          </div>
        </Card>
      ))}
    </div>
  )
}
