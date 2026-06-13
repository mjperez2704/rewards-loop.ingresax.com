'use client'

import Link from 'next/link'
import { Eye, Mail, MessageCircle, Pencil, Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { deleteClient, updateClient } from '@/app/actions/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Client {
  id: string
  name: string
  email: string
  phone: string | null
  status: string
  loyaltyTier: string
  totalPoints: number
  createdAt: Date | string
  lastVisit?: string
}

const tierColors: Record<string, string> = {
  Plata: 'status-muted',
  Silver: 'status-muted',
  Oro: 'status-warning',
  Gold: 'status-warning',
  Platino: 'status-brand',
  Platinum: 'status-brand',
  Diamante: 'border-brand-gold/25 bg-brand-gold-soft text-brand-ink',
  Diamond: 'border-brand-gold/25 bg-brand-gold-soft text-brand-ink',
}

function formatDate(date: Date | string | undefined) {
  if (!date) return 'Sin registro'
  return new Date(date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleDelete = async (id: string) => {
    await deleteClient(id)
  }

  const saveClient = () => {
    if (!editingClient) return

    startTransition(async () => {
      await updateClient(editingClient.id, {
        name: editingClient.name,
        email: editingClient.email,
        phone: editingClient.phone || undefined,
        loyaltyTier: editingClient.loyaltyTier,
        status: editingClient.status,
        totalPoints: editingClient.totalPoints,
      })
      setEditingClient(null)
    })
  }

  return (
    <Card className="premium-card overflow-hidden">
      <div className="flex flex-col justify-between gap-3 border-b border-border p-5 md:flex-row md:items-center">
        <div>
          <h2 className="text-lg font-semibold">Tabla de clientes</h2>
          <p className="text-sm text-muted-foreground">Datos, puntos, nivel y última visita</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="status-brand rounded-full">
            {clients.length} clientes
          </Badge>
          <Badge variant="outline" className="status-success rounded-full">
            {clients.filter((client) => client.status === 'active').length} activos
          </Badge>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="p-8 text-center">
          <p className="font-semibold">Sin clientes registrados</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Agrega el primer cliente para empezar a acumular puntos, visitas y recompensas reales.
          </p>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-medium">Nombre</th>
              <th className="px-5 py-3 font-medium">Teléfono / WhatsApp</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Puntos acumulados</th>
              <th className="px-5 py-3 font-medium">Nivel</th>
              <th className="px-5 py-3 font-medium">Última visita</th>
              <th className="px-5 py-3 font-medium">Estado</th>
              <th className="px-5 py-3 text-right font-medium">Perfil</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {clients.map((client) => (
              <tr key={client.id} className="transition-colors hover:bg-muted/30">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <span className="text-sm font-semibold">{client.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Cliente desde {formatDate(client.createdAt)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MessageCircle className="size-4 text-brand-success" />
                    {client.phone || 'Sin teléfono'}
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="size-4" />
                    {client.email}
                  </div>
                </td>
                <td className="px-5 py-4 text-sm font-semibold">{client.totalPoints.toLocaleString()} pts</td>
                <td className="px-5 py-4">
                  <Badge variant="outline" className={tierColors[client.loyaltyTier] || 'border-border bg-muted text-muted-foreground'}>
                    {client.loyaltyTier}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{formatDate(client.lastVisit || client.createdAt)}</td>
                <td className="px-5 py-4">
                  <Badge variant="outline" className={client.status === 'active' ? 'status-success' : 'status-muted'}>
                    {client.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="rounded-lg bg-background" onClick={() => setEditingClient(client)}>
                      <Pencil className="size-4" />
                      Editar
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-lg bg-background">
                      <Link href={`/dashboard/clients/${client.id}`}>
                        <Eye className="size-4" />
                        Ver perfil
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(client.id)}
                      className="rounded-lg text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      <Dialog open={Boolean(editingClient)} onOpenChange={(open) => !open && setEditingClient(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Nombre completo</Label>
                <Input value={editingClient.name} onChange={(event) => setEditingClient({ ...editingClient, name: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Correo electrónico</Label>
                <Input type="email" value={editingClient.email} onChange={(event) => setEditingClient({ ...editingClient, email: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input value={editingClient.phone ?? ''} onChange={(event) => setEditingClient({ ...editingClient, phone: event.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Nivel</Label>
                <Select value={editingClient.loyaltyTier} onValueChange={(value) => setEditingClient({ ...editingClient, loyaltyTier: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Plata">Plata</SelectItem>
                    <SelectItem value="Oro">Oro</SelectItem>
                    <SelectItem value="Platino">Platino</SelectItem>
                    <SelectItem value="Diamante">Diamante</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={editingClient.status} onValueChange={(value) => setEditingClient({ ...editingClient, status: value })}>
                  <SelectTrigger className="bg-background">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Puntos acumulados</Label>
                <Input
                  type="number"
                  min="0"
                  value={editingClient.totalPoints}
                  onChange={(event) => setEditingClient({ ...editingClient, totalPoints: Number(event.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingClient(null)}>Cancelar</Button>
            <Button onClick={saveClient} disabled={isPending}>Guardar cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
