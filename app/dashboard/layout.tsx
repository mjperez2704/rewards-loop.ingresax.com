import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { DashboardSidebar } from '@/components/dashboard/sidebar'
import { DashboardHeader } from '@/components/dashboard/header'
import { ModuleAccessGate } from '@/components/dashboard/module-access-gate'
import { getBusinessAccountForUser } from '@/app/actions/admin-accounts'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  const account = await getBusinessAccountForUser(session.user.email)

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={session.user} entitlements={account.serviceEntitlements} />
      <div className="flex-1 flex flex-col min-h-screen lg:pl-72">
        <DashboardHeader user={session.user} />
        <main className="flex-1 px-5 py-6 md:px-6 xl:px-8">
          <ModuleAccessGate accountName={account.businessName} entitlements={account.serviceEntitlements}>
            {children}
          </ModuleAccessGate>
        </main>
      </div>
    </div>
  )
}
