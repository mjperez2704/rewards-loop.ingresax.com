import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { canAccessAdminPanel } from '@/lib/admin-access'
import { AdminAccessDenied } from '@/components/admin/admin-access-denied'

export default async function AdminUnauthorizedPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/admin/login')
  }

  if (await canAccessAdminPanel(session.user.email)) {
    redirect('/admin')
  }

  return <AdminAccessDenied email={session.user.email} />
}
