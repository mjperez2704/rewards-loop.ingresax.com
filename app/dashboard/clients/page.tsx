import { getClients } from '@/app/actions/dashboard'
import { ClientsTable } from '@/components/dashboard/clients-table'
import { AddClientDialog } from '@/components/dashboard/add-client-dialog'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Clientes"
        title="Módulo de clientes"
        description="Gestiona WhatsApp, email, puntos, niveles, estado y perfiles individuales."
        actions={<AddClientDialog />}
      />

      <ClientsTable clients={clients} />
    </div>
  )
}
