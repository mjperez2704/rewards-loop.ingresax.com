import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { getServicePlans } from '@/app/actions/admin-plans'
import { AdminAccountsPage } from '@/components/admin/accounts-page'

export default async function AdminAccountsRoute() {
  const [accounts, plans] = await Promise.all([
    getAdminAccounts(),
    getServicePlans(),
  ])

  return <AdminAccountsPage accounts={accounts} plans={plans} />
}
