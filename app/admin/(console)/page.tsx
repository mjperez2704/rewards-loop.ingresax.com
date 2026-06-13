import { getAdminOverviewData } from '@/app/actions/admin-accounts'
import { AdminOverviewPage } from '@/components/admin/overview-page'

export default async function AdminPage() {
  const data = await getAdminOverviewData()

  return <AdminOverviewPage accounts={data.accounts} tickets={data.tickets} feedback={data.feedback} />
}
