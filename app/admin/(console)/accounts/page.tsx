import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { AdminAccountsPage } from '@/components/admin/accounts-page'

export default async function AdminAccountsRoute() {
  const accounts = await getAdminAccounts()

  return <AdminAccountsPage accounts={accounts} />
}
