'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { BadgeCheck, Gift, QrCode, Search, UserPlus, WalletCards } from 'lucide-react'
import {
  awardClientPoints,
  createClient,
  redeemRewardForClient,
} from '@/app/actions/dashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ClientRecord = {
  id: string
  userId: string
  name: string
  email: string
  phone: string | null
  status: string
  loyaltyTier: string
  totalPoints: number
  createdAt: Date
  updatedAt: Date
}

type RewardRecord = {
  id: string
  userId: string
  title: string
  description: string | null
  pointsRequired: number
  category: string
  status: string
  createdAt: Date
  updatedAt: Date
}

const operationIcons = [UserPlus, QrCode, Gift, WalletCards, Search]
const employeeOperations = [
  { title: 'Registrar cliente', description: 'Alta rápida con nombre, email y teléfono.', status: 'Caja' },
  { title: 'Escanear QR', description: 'Pega o lee el código y localiza el wallet del cliente.', status: 'Recepción' },
  { title: 'Aplicar recompensa', description: 'Valida puntos disponibles y registra el canje.', status: 'POS' },
  { title: 'Verificar puntos', description: 'Consulta saldo antes de cobrar o cerrar visita.', status: 'Rápido' },
  { title: 'Encontrar cliente', description: 'Busca por nombre, teléfono, email o ID.', status: 'Soporte' },
]

function defaultClientForm() {
  return {
    name: '',
    email: '',
    phone: '',
  }
}

export function EmployeeOperationsPage({
  clients,
  rewards,
}: {
  clients: ClientRecord[]
  rewards: RewardRecord[]
}) {
  const [clientRecords, setClientRecords] = useState(clients)
  const [query, setQuery] = useState('')
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id ?? '')
  const [clientForm, setClientForm] = useState(defaultClientForm)
  const [pointsAmount, setPointsAmount] = useState('10')
  const [pointsDescription, setPointsDescription] = useState('')
  const [selectedRewardId, setSelectedRewardId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isPending, startTransition] = useTransition()

  const activeRewards = useMemo(
    () => rewards.filter((reward) => reward.status === 'active'),
    [rewards],
  )
  const filteredClients = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return clientRecords

    return clientRecords.filter((client) => {
      const search = `${client.id} ${client.name} ${client.email} ${client.phone ?? ''}`.toLowerCase()
      return search.includes(normalized)
    })
  }, [clientRecords, query])
  const selectedClient = clientRecords.find((client) => client.id === selectedClientId) ?? filteredClients[0]
  const selectedReward = activeRewards.find((reward) => reward.id === selectedRewardId)
  const totalPoints = clientRecords.reduce((sum, client) => sum + client.totalPoints, 0)
  const activeClients = clientRecords.filter((client) => client.status === 'active').length

  useEffect(() => {
    setClientRecords(clients)
    setSelectedClientId((current) => (
      clients.some((client) => client.id === current)
        ? current
        : clients[0]?.id ?? ''
    ))
  }, [clients])

  useEffect(() => {
    if (!selectedRewardId && activeRewards[0]) {
      setSelectedRewardId(activeRewards[0].id)
    }
  }, [activeRewards, selectedRewardId])

  const setClientField = (key: keyof ReturnType<typeof defaultClientForm>, value: string) => {
    setClientForm((current) => ({ ...current, [key]: value }))
  }

  const updateClient = (client?: ClientRecord) => {
    if (!client) return
    setClientRecords((current) => current.map((item) => (item.id === client.id ? client : item)))
    setSelectedClientId(client.id)
  }

  const registerClient = () => {
    setMessage('')
    setError('')
    startTransition(async () => {
      try {
        const created = await createClient({
          name: clientForm.name.trim(),
          email: clientForm.email.trim(),
          phone: clientForm.phone.trim() || undefined,
          loyaltyTier: 'Inicial',
        })
        const now = new Date()
        const nextClient: ClientRecord = {
          id: created.id,
          userId: '',
          name: clientForm.name.trim(),
          email: clientForm.email.trim(),
          phone: clientForm.phone.trim() || null,
          status: 'active',
          loyaltyTier: 'Inicial',
          totalPoints: 0,
          createdAt: now,
          updatedAt: now,
        }

        setClientRecords((current) => [nextClient, ...current])
        setSelectedClientId(created.id)
        setClientForm(defaultClientForm())
        setQuery('')
        setMessage('Cliente registrado.')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudo registrar el cliente.')
      }
    })
  }

  const awardPoints = () => {
    if (!selectedClient) return
    setMessage('')
    setError('')
    startTransition(async () => {
      try {
        const updated = await awardClientPoints({
          clientId: selectedClient.id,
          amount: Number(pointsAmount),
          description: pointsDescription.trim() || undefined,
        })
        updateClient(updated)
        setPointsDescription('')
        setMessage('Puntos emitidos.')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudieron emitir los puntos.')
      }
    })
  }

  const redeemReward = () => {
    if (!selectedClient || !selectedRewardId) return
    setMessage('')
    setError('')
    startTransition(async () => {
      try {
        const updated = await redeemRewardForClient({
          clientId: selectedClient.id,
          rewardId: selectedRewardId,
        })
        updateClient(updated)
        setMessage('Recompensa canjeada.')
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : 'No se pudo canjear la recompensa.')
      }
    })
  }

  return (
    <div className="product-shell">
      <section className="product-page-header">
        <div>
          <p className="product-kicker">Empleado del negocio</p>
          <h1 className="product-title">Operación POS</h1>
          <p className="product-description">
            Registro, búsqueda, emisión de puntos y canje de recompensas usando clientes y recompensas reales del negocio.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setQuery(selectedClient?.id ?? '')} disabled={!selectedClient}>
            <QrCode className="size-4" />
            Usar ID/QR
          </Button>
          <Button variant="outline" onClick={() => document.getElementById('quick-client-name')?.focus()}>
            <UserPlus className="size-4" />
            Registrar cliente
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['Clientes registrados', clientRecords.length.toLocaleString(), `${activeClients.toLocaleString()} activos`],
          ['Puntos en wallets', totalPoints.toLocaleString(), 'Saldo acumulado'],
          ['Recompensas activas', activeRewards.length.toLocaleString(), `${rewards.length.toLocaleString()} totales`],
          ['Cliente seleccionado', selectedClient ? selectedClient.totalPoints.toLocaleString() : '0', 'Puntos disponibles'],
        ].map(([label, value, helper]) => (
          <Card key={label} className="premium-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-normal">{value}</p>
            <p className="mt-2 text-xs font-semibold text-brand-teal">{helper}</p>
          </Card>
        ))}
      </section>

      {(message || error) && (
        <div className={`rounded-lg border px-4 py-3 text-sm ${error ? 'border-destructive/25 bg-destructive/10 text-destructive' : 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <Card className="premium-card p-5">
            <p className="product-kicker">Registro rápido</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Nuevo cliente</h2>
            <div className="mt-5 grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="quick-client-name">Nombre</Label>
                <Input
                  id="quick-client-name"
                  value={clientForm.name}
                  onChange={(event) => setClientField('name', event.target.value)}
                  placeholder="Nombre del cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-client-email">Email</Label>
                <Input
                  id="quick-client-email"
                  type="email"
                  value={clientForm.email}
                  onChange={(event) => setClientField('email', event.target.value)}
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quick-client-phone">Teléfono</Label>
                <Input
                  id="quick-client-phone"
                  value={clientForm.phone}
                  onChange={(event) => setClientField('phone', event.target.value)}
                  placeholder="+1 555 000 0000"
                />
              </div>
              <Button
                onClick={registerClient}
                disabled={isPending || !clientForm.name.trim() || !clientForm.email.trim()}
              >
                <UserPlus className="size-4" />
                Guardar cliente
              </Button>
            </div>
          </Card>

          <Card className="premium-card p-5">
            <p className="product-kicker">Búsqueda rápida</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Encontrar cliente</h2>
            <div className="relative mt-5">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="pl-10"
                placeholder="Nombre, teléfono, email o código QR"
              />
            </div>
            <div className="mt-5 max-h-[360px] overflow-auto rounded-lg border border-border/75">
              {filteredClients.length === 0 && (
                <div className="p-4 text-sm text-muted-foreground">No hay clientes que coincidan.</div>
              )}
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => setSelectedClientId(client.id)}
                  className={`block w-full border-b border-border/70 px-4 py-3 text-left last:border-b-0 hover:bg-muted/45 ${selectedClient?.id === client.id ? 'bg-muted/60' : 'bg-background'}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{client.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{client.email} · {client.phone ?? 'Sin teléfono'}</p>
                    </div>
                    <Badge variant="outline">{client.totalPoints.toLocaleString()} pts</Badge>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="premium-card p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="product-kicker">Wallet del cliente</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal">
                  {selectedClient?.name ?? 'Selecciona un cliente'}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {selectedClient ? `${selectedClient.email} · ${selectedClient.phone ?? 'Sin teléfono'}` : 'Busca o registra un cliente para operar.'}
                </p>
              </div>
              <Badge variant="outline" className="status-success">
                <WalletCards className="size-3" />
                {(selectedClient?.totalPoints ?? 0).toLocaleString()} puntos
              </Badge>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="premium-card-muted p-4">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-5 text-brand-teal" />
                  <p className="font-semibold">Emitir puntos</p>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="space-y-2">
                    <Label>Puntos</Label>
                    <Input
                      type="number"
                      min="1"
                      value={pointsAmount}
                      onChange={(event) => setPointsAmount(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Motivo</Label>
                    <Input
                      value={pointsDescription}
                      onChange={(event) => setPointsDescription(event.target.value)}
                      placeholder="Compra, visita, ajuste..."
                    />
                  </div>
                  <Button onClick={awardPoints} disabled={isPending || !selectedClient}>
                    Emitir puntos
                  </Button>
                </div>
              </div>

              <div className="premium-card-muted p-4">
                <div className="flex items-center gap-2">
                  <Gift className="size-5 text-brand-teal" />
                  <p className="font-semibold">Canjear recompensa</p>
                </div>
                <div className="mt-4 grid gap-3">
                  <div className="space-y-2">
                    <Label>Recompensa</Label>
                    <Select value={selectedRewardId} onValueChange={setSelectedRewardId}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Selecciona recompensa" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeRewards.map((reward) => (
                          <SelectItem key={reward.id} value={reward.id}>
                            {reward.title} · {reward.pointsRequired} pts
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-lg border border-border/75 bg-background p-3 text-sm text-muted-foreground">
                    {selectedReward
                      ? `${selectedReward.category} · requiere ${selectedReward.pointsRequired.toLocaleString()} puntos`
                      : 'No hay recompensas activas configuradas.'}
                  </div>
                  <Button
                    onClick={redeemReward}
                    disabled={isPending || !selectedClient || !selectedReward || selectedClient.totalPoints < selectedReward.pointsRequired}
                  >
                    Canjear
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="premium-card p-5">
            <p className="product-kicker">Flujo de operación</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Acciones por empleado</h2>
            <div className="mt-6 grid gap-3 md:grid-cols-2">
              {employeeOperations.map((item, index) => {
                const Icon = operationIcons[index] ?? BadgeCheck

                return (
                  <div key={item.title} className="premium-card-muted p-4">
                    <div className="flex items-start gap-3">
                      <div className="premium-icon-soft">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold">{item.title}</p>
                          <Badge variant="outline">{item.status}</Badge>
                        </div>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
