import { BadgeCheck, Gift, QrCode, Search, UserPlus, WalletCards } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const operationIcons = [UserPlus, QrCode, Gift, WalletCards, Search]
const employeeOperations = [
  { title: 'Registrar cliente', description: 'Nombre, teléfono, consentimiento y nivel inicial.', action: 'Abrir registro', status: 'Caja' },
  { title: 'Escanear QR', description: 'Identifica wallet, puntos, nivel y recompensas disponibles.', action: 'Escanear', status: 'Recepción' },
  { title: 'Aplicar recompensa', description: 'Valida cupón, descuenta puntos y registra el canje.', action: 'Canjear', status: 'POS' },
  { title: 'Verificar puntos', description: 'Busca por nombre, teléfono o QR antes de cobrar.', action: 'Consultar', status: 'Rápido' },
  { title: 'Encontrar cliente', description: 'Historial, última visita, gasto y referidos.', action: 'Buscar', status: 'Soporte' },
]

export function EmployeeOperationsPage() {
  return (
    <div className="product-shell">
      <section className="product-page-header">
        <div>
          <p className="product-kicker">Empleado del negocio</p>
          <h1 className="product-title">Operación POS</h1>
          <p className="product-description">
            Herramientas rápidas para recepción, caja, barberos, meseros y asistentes: registrar clientes, escanear QR,
            aplicar recompensas, verificar puntos y encontrar perfiles.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <QrCode className="size-4" />
            Escanear QR
          </Button>
          <Button variant="outline">
            <UserPlus className="size-4" />
            Registrar cliente
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {[
          ['Clientes hoy', '0', 'Turno actual'],
          ['QR escaneados', '0', 'Turno actual'],
          ['Canjes aplicados', '0', '$0 valor'],
          ['Puntos emitidos', '0', 'Compras y visitas'],
          ['Búsquedas', '0', 'Nombre o teléfono'],
        ].map(([label, value, helper]) => (
          <Card key={label} className="premium-card p-5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-3 text-3xl font-semibold tracking-normal">{value}</p>
            <p className="mt-2 text-xs font-semibold text-brand-teal">{helper}</p>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">Búsqueda rápida</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Encontrar cliente</h2>
          <div className="relative mt-5">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-10" placeholder="Nombre, teléfono, email o código QR" />
          </div>
          <div className="mt-5 rounded-lg border border-border/75 bg-background p-4">
            <p className="text-sm text-muted-foreground">Busca un cliente real para ver puntos, estado y acciones disponibles.</p>
          </div>
        </Card>

        <Card className="premium-card p-5">
          <p className="product-kicker">Flujo de operación</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Acciones esperadas por empleado</h2>
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
                      <Button className="mt-3" variant="outline" size="sm">{item.action}</Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>
    </div>
  )
}
