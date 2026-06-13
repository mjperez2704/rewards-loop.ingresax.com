import { getAdminConsoleUsers } from '@/app/actions/admin-users'
import { AdminUsersPage } from '@/components/admin/users-page'

export default async function AdminUsersRoute() {
  const users = await getAdminConsoleUsers()

  return <AdminUsersPage initialUsers={users} />
}
