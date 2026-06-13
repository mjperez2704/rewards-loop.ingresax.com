import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { getServicePlans } from '@/app/actions/admin-plans'
import { AdminPlansPage } from '@/components/admin/plans-page'

export default async function AdminPlansRoute() {
  const [accounts, plans] = await Promise.all([
    getAdminAccounts(),
    getServicePlans(),
  ])

  return <AdminPlansPage accounts={accounts} initialPlans={plans} />
}
