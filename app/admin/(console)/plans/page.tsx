import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { AdminPlansPage } from '@/components/admin/plans-page'

export default async function AdminPlansRoute() {
  const accounts = await getAdminAccounts()

  return <AdminPlansPage accounts={accounts} />
}
