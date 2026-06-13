import { Gift, QrCode, Share2, ShieldCheck, Smartphone, UserPlus, Wallet } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

const momentIcons = [QrCode, UserPlus, Wallet, Gift, Share2]
const customerPortalMoments = [
  { title: 'Escanear QR', description: 'El cliente entra desde mostrador, mesa, recepción o link.' },
  { title: 'Registrarse', description: 'Crea perfil con teléfono y acepta recibir recompensas.' },
  { title: 'Usar wallet', description: 'Consulta puntos, nivel, QR personal y beneficios disponibles.' },
  { title: 'Canjear recompensas', description: 'Muestra QR o código para aplicar puntos, cupón o cashback.' },
  { title: 'Invitar amigos', description: 'Comparte link y gana puntos cuando el referido compra.' },
]

export function CustomerPortalPage() {
  return (
    <div className="product-shell">
      <section className="product-page-header">
        <div>
          <p className="product-kicker">Cliente final</p>
          <h1 className="product-title">Portal cliente y wallet</h1>
          <p className="product-description">
            Experiencia para los clientes de barberías, restaurantes, gimnasios, cafeterías y otros negocios afiliados:
            escanear QR, registrarse, consultar wallet, recibir recompensas y compartir referidos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <QrCode className="size-4" />
            Generar QR público
          </Button>
          <Button variant="outline">
            <Smartphone className="size-4" />
            Vista móvil
          </Button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="premium-card overflow-hidden p-0">
          <div className="border-b border-border p-5">
            <p className="product-kicker">Vista del cliente</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Wallet digital</h2>
          </div>
          <div className="p-5">
            <div className="rounded-lg bg-primary p-5 text-primary-foreground">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm opacity-75">INGRESAX Rewards</p>
                  <p className="mt-3 text-3xl font-semibold tracking-normal">0 pts</p>
                  <p className="mt-1 text-sm opacity-75">Sin wallet emitida</p>
                </div>
                <div className="flex size-16 items-center justify-center rounded-lg bg-primary-foreground text-primary">
                  <QrCode className="size-9" strokeWidth={1.5} />
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs opacity-80">
                  <span>Progreso a Platino</span>
                  <span>0%</span>
                </div>
                <Progress value={0} className="bg-primary-foreground/20" />
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                ['Recibir', 'Pendiente'],
                ['Canjear', '0 pts'],
                ['Invitar', 'Pendiente'],
              ].map(([label, value]) => (
                <div key={label} className="premium-card-muted p-4">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="premium-card p-5">
          <p className="product-kicker">Journey del cliente</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Qué puede hacer desde el QR</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {customerPortalMoments.map((item, index) => {
              const Icon = momentIcons[index] ?? ShieldCheck

              return (
                <div key={item.title} className="premium-card-muted p-4">
                  <div className="flex items-start gap-3">
                    <div className="premium-icon-soft">
                      <Icon className="size-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 rounded-lg border border-border/75 bg-background p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="status-muted">
                <ShieldCheck className="size-3" />
                Opt-in pendiente
              </Badge>
              <Badge variant="outline" className="status-muted">Wallet pendiente</Badge>
              <Badge variant="outline">Referido pendiente</Badge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              El negocio puede usar este portal como link público, QR físico y acceso desde WhatsApp para que cada
              cliente vea sus puntos sin pedir ayuda al personal.
            </p>
          </div>
        </Card>
      </section>
    </div>
  )
}
