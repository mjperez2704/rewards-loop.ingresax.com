import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { AuthForm } from '@/components/auth-form'
import { canAccessAdminPanel } from '@/lib/admin-access'

export default async function AdminLoginPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session?.user) {
    redirect((await canAccessAdminPanel(session.user.email)) ? '/admin' : '/admin/unauthorized')
  }

  return (
    <AuthForm
      mode="sign-in"
      redirectTo="/admin"
      heading="Acceso administrador"
      subheading="Inicia sesión con una cuenta autorizada para administrar clientes SaaS, planes y microservicios."
      showModeLink={false}
    />
  )
}
