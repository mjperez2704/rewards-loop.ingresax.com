'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus } from 'lucide-react'
import { createReward } from '@/app/actions/dashboard'

export function AddRewardDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pointsRequired, setPointsRequired] = useState('')
  const [category, setCategory] = useState('Puntos')
  const categories = [
    'Puntos',
    'Cupones',
    'Cashback',
    'Sellos digitales',
    'Regalos por cumpleaños',
    'Recompensas por referidos',
    'Membresías VIP',
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await createReward({
      title,
      description: description || undefined,
      pointsRequired: parseInt(pointsRequired),
      category,
    })

    setLoading(false)
    setOpen(false)
    setTitle('')
    setDescription('')
    setPointsRequired('')
    setCategory('Puntos')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Recompensa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Recompensa</DialogTitle>
          <DialogDescription>
            Crea una nueva recompensa para tu programa de lealtad.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nombre de la recompensa</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="20% de descuento"
              required
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Válido en toda la tienda"
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="points">Puntos requeridos</Label>
            <Input
              id="points"
              type="number"
              value={pointsRequired}
              onChange={(e) => setPointsRequired(e.target.value)}
              placeholder="500"
              required
              min="1"
              className="h-10 rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              {categories.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-lg">
              {loading ? 'Guardando...' : 'Crear Recompensa'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
