import { Award, CheckCircle2, Share2, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default function ReferralsPage() {
  const referralRows: Array<{ advocate: string; invited: string; status: string; reward: string; date: string }> = []

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Referidos"
        title="Programa de referidos"
        description="Premia a clientes que invitan nuevos compradores y mide conversiones."
        actions={
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Share2 className="size-4" />
          Crear enlace de referido
        </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Users, label: 'Referidos totales', value: '0' },
          { icon: CheckCircle2, label: 'Conversiones', value: '0' },
          { icon: Award, label: 'Premios entregados', value: '0 pts' },
        ].map((metric) => (
          <Card key={metric.label} className="premium-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="mt-4 text-3xl font-semibold">{metric.value}</p>
              </div>
              <div className="premium-icon">
                <metric.icon className="size-5" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="premium-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Actividad de referidos</h2>
          <p className="text-sm text-muted-foreground">Invitaciones y recompensas</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Invitado</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium">Recompensa</th>
                <th className="px-5 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {referralRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-sm text-muted-foreground">
                    Sin referidos registrados todavía.
                  </td>
                </tr>
              )}
              {referralRows.map((row) => (
                <tr key={`${row.advocate}-${row.invited}`}>
                  <td className="px-5 py-4 text-sm font-semibold">{row.advocate}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{row.invited}</td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="status-brand">{row.status}</Badge>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{row.reward}</td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
