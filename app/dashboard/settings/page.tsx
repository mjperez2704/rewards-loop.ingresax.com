import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { SettingsForm } from '@/components/dashboard/settings-form'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function SettingsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const user = session?.user

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Configuración"
        title="Configuración del negocio"
        description="Nombre, logo, colores, sucursales, usuarios, roles e integraciones."
      />

      <SettingsForm user={user} />
    </div>
  )
}
