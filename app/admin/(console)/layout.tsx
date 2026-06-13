import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AdminShell } from '@/components/admin/admin-shell'
import { canAccessAdminPanel } from '@/lib/admin-access'
import { auth } from '@/lib/auth'

export default async function AdminConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user) {
    redirect('/admin/login')
  }

  if (!(await canAccessAdminPanel(session.user.email))) {
    redirect('/admin/unauthorized')
  }

  return <AdminShell user={session.user}>{children}</AdminShell>
}
