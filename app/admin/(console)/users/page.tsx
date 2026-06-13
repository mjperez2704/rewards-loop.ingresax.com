import { getAdminConsoleUsers, getAdminRoleRecords } from '@/app/actions/admin-users'
import { AdminUsersPage } from '@/components/admin/users-page'

export default async function AdminUsersRoute() {
  const [users, roles] = await Promise.all([
    getAdminConsoleUsers(),
    getAdminRoleRecords(),
  ])

  return <AdminUsersPage initialUsers={users} initialRoles={roles} />
}
