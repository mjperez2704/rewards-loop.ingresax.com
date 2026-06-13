import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { AdminServicesPage } from '@/components/admin/services-page'

export default async function AdminServicesRoute() {
  const accounts = await getAdminAccounts()

  return <AdminServicesPage accounts={accounts} />
}
