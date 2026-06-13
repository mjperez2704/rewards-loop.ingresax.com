'use client'

import Link from 'next/link'
import { Eye, Mail, MessageCircle, Trash2 } from 'lucide-react'
import { deleteClient } from '@/app/actions/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
  const handleDelete = async (id: string) => {
    await deleteClient(id)
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
    </Card>
  )
}
