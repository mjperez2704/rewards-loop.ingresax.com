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
import { createCampaign } from '@/app/actions/dashboard'

export function AddCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [multiplier, setMultiplier] = useState('2')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    await createCampaign({
      name,
      description: description || undefined,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      pointsMultiplier: parseFloat(multiplier),
    })

    setLoading(false)
    setOpen(false)
    setName('')
    setDescription('')
    setStartDate('')
    setEndDate('')
    setMultiplier('2')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="rounded-lg">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Campaña
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Campaña</DialogTitle>
          <DialogDescription>
            Crea una campaña promocional con multiplicador de puntos.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la campaña</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Puntos Dobles de Verano"
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
              placeholder="Gana el doble de puntos en todas tus compras"
              className="h-10 rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha inicio</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="h-10 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha fin</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="h-10 rounded-lg"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="multiplier">Multiplicador de puntos</Label>
            <select
              id="multiplier"
              value={multiplier}
              onChange={(e) => setMultiplier(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm"
            >
              <option value="1.5">1.5x puntos</option>
              <option value="2">2x puntos</option>
              <option value="3">3x puntos</option>
              <option value="5">5x puntos</option>
            </select>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-lg">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="rounded-lg">
              {loading ? 'Guardando...' : 'Crear Campaña'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
