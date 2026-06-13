import { getAdminAccounts } from '@/app/actions/admin-accounts'
import { AdminBusinessPreviewPage } from '@/components/admin/business-preview-page'

export default async function AdminBusinessPreviewRoute() {
  const accounts = await getAdminAccounts()

  return <AdminBusinessPreviewPage account={accounts[0]} />
}
