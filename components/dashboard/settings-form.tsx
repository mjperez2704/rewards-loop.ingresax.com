'use client'

import Image from 'next/image'
import { useMemo, useState, useTransition } from 'react'
import { Building2, Globe2, MessageCircle, Palette, QrCode, Shield, ShieldCheck, Store, Upload, UserCog, Users, Wallet } from 'lucide-react'
import { updateCurrentBusinessSettings } from '@/app/actions/admin-accounts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

const roles = ['Propietario', 'Gerente', 'Marketing', 'Equipo operativo', 'Analista']
const integrationSettings = [
  { icon: MessageCircle, name: 'Integración con WhatsApp', description: 'Campañas, recordatorios y mensajes por segmento', status: 'No configurado' },
  { icon: ShieldCheck, name: 'Integración con sitio web', description: 'Registro de clientes y beneficios desde la página pública', status: 'No configurado' },
  { icon: Wallet, name: 'Integración con wallet digital', description: 'Tarjetas digitales con puntos, nivel y QR de cliente', status: 'No configurado' },
  { icon: QrCode, name: 'QR en punto de venta', description: 'Inscripción rápida desde caja, mesa o recepción', status: 'No configurado' },
]

function parseBusinessName(name?: string | null) {
  const safeName = name?.trim() || ''
  const match = safeName.match(/^(.*?)\s+\((.*?)\)$/)
  return match?.[2]?.trim() || safeName || 'Mi negocio'
}

export function SettingsForm({ user }: { user: User | undefined }) {
  const [businessName, setBusinessName] = useState(() => parseBusinessName(user?.name))
  const [brandColor, setBrandColor] = useState('#2AA7A1')
  const [accentColor, setAccentColor] = useState('#202735')
  const [savedMessage, setSavedMessage] = useState('')
  const [isPending, startTransition] = useTransition()
  const users = useMemo(() => user ? [{ name: user.name || 'Usuario', role: 'Propietario', email: user.email }] : [], [user])

  const handleSave = () => {
    startTransition(async () => {
      await updateCurrentBusinessSettings({ businessName })
      setSavedMessage('Configuración guardada.')
    })
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <Card className="premium-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="premium-icon">
              <Building2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Datos del negocio</h2>
              <p className="text-sm text-muted-foreground">Marca y operación</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="business-name">Nombre del negocio</Label>
              <Input id="business-name" value={businessName} onChange={(event) => setBusinessName(event.target.value)} className="rounded-lg" />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="premium-card-muted flex items-center justify-between gap-4 p-4">
                <Image src="/logo_horizontal_2.png" alt="Logo" width={170} height={34} className="h-8 w-auto object-contain" />
                <Button variant="outline" size="sm" className="bg-background">
                  <Upload className="size-4" />
                  Cambiar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Colores de marca</Label>
              <div className="grid grid-cols-2 gap-3">
                <label className="premium-card-muted p-3">
                  <span className="text-xs text-muted-foreground">Primario</span>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="color" value={brandColor} onChange={(event) => setBrandColor(event.target.value)} className="size-8 rounded border-0 bg-transparent" />
                    <span className="text-sm font-semibold">{brandColor}</span>
                  </div>
                </label>
                <label className="premium-card-muted p-3">
                  <span className="text-xs text-muted-foreground">Acento</span>
                  <div className="mt-2 flex items-center gap-2">
                    <input type="color" value={accentColor} onChange={(event) => setAccentColor(event.target.value)} className="size-8 rounded border-0 bg-transparent" />
                    <span className="text-sm font-semibold">{accentColor}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {savedMessage && <p className="mt-5 text-sm font-medium text-brand-success">{savedMessage}</p>}
          <Button onClick={handleSave} disabled={isPending} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            {isPending ? 'Guardando...' : 'Guardar configuración'}
          </Button>
        </Card>

        <Card className="premium-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="premium-icon-soft">
              <Store className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Sucursales</h2>
              <p className="text-sm text-muted-foreground">Ubicaciones conectadas</p>
            </div>
          </div>
          <div className="premium-card-muted p-4">
            <p className="font-semibold">Sin sucursales adicionales</p>
            <p className="mt-1 text-xs text-muted-foreground">La sucursal principal se crea con la cuenta del negocio.</p>
          </div>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="premium-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="premium-icon-soft">
              <Users className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Usuarios y roles</h2>
              <p className="text-sm text-muted-foreground">Permisos del equipo</p>
            </div>
          </div>
          <div className="space-y-3">
            {users.map((member) => (
              <div key={member.email} className="premium-card-muted flex items-center justify-between gap-4 p-3">
                <div>
                  <p className="text-sm font-semibold">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant="outline" className="status-brand">{member.role}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {roles.map((role) => (
              <Badge key={role} variant="outline" className="rounded-full bg-background">{role}</Badge>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="premium-icon-soft">
              <Globe2 className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Integraciones</h2>
              <p className="text-sm text-muted-foreground">WhatsApp, sitio web y wallet</p>
            </div>
          </div>
          <div className="space-y-3">
            {integrationSettings.map((integration) => (
              <div key={integration.name} className="premium-card-muted flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-background">
                    <integration.icon className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{integration.name}</p>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="status-muted">{integration.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="premium-card p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="premium-icon-soft">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="font-semibold">Cuenta</h2>
              <p className="text-sm text-muted-foreground">{user?.email || 'Usuario conectado'}</p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" className="justify-start bg-background">
              <UserCog className="size-4" />
              Seguridad
            </Button>
            <Button variant="outline" className="justify-start bg-background">
              <Palette className="size-4" />
              Branding avanzado
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
