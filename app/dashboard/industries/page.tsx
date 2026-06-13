import { CheckCircle2, Coffee, Dumbbell, HeartPulse, PawPrint, Scissors, Sparkles, UtensilsCrossed, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

const industryCards = [
  { icon: Scissors, name: 'Barberías', benefits: ['Sellos por corte', 'Referidos con descuento', 'Recordatorios por WhatsApp'] },
  { icon: Coffee, name: 'Cafeterías', benefits: ['Bebida gratis', 'Wallet para puntos', 'Cumpleaños especial'] },
  { icon: UtensilsCrossed, name: 'Restaurantes', benefits: ['Cashback por consumo', 'Reservas VIP', 'Campañas por fecha'] },
  { icon: Sparkles, name: 'Salones de belleza', benefits: ['Paquetes recurrentes', 'Cumpleaños especial', 'Membresías premium'] },
  { icon: HeartPulse, name: 'Dentistas', benefits: ['Recordatorios de cita', 'Referidos familiares', 'Crédito en tratamientos'] },
  { icon: Dumbbell, name: 'Gimnasios', benefits: ['Check-ins con puntos', 'Retos mensuales', 'Membresías VIP'] },
  { icon: PawPrint, name: 'Veterinarias', benefits: ['Consultas con puntos', 'Promos de alimento', 'Cumpleaños de mascota'] },
  { icon: Wrench, name: 'Talleres mecánicos', benefits: ['Club de mantenimiento', 'Diagnóstico gratis', 'Seguimiento post-servicio'] },
]

export default function IndustriesPage() {
  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Industrias"
        title="Módulo de industrias"
        description="Tarjetas por vertical con beneficios recomendados para cada tipo de negocio."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {industryCards.map((industry) => (
          <Card key={industry.name} className="premium-card p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="premium-icon">
                <industry.icon className="size-5" strokeWidth={1.5} />
              </div>
              <Badge variant="outline" className="status-brand">Activo</Badge>
            </div>
            <h2 className="font-semibold">{industry.name}</h2>
            <ul className="mt-5 space-y-3">
              {industry.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2 text-sm leading-5 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-brand-teal" />
                  {benefit}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  )
}
