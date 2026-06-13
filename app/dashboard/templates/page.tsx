import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { TemplatesGallery } from '@/components/dashboard/templates-gallery'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function TemplatesPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session?.user) {
    redirect('/sign-in')
  }

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Página pública"
        title="Plantillas para tu página pública"
        description="Elige una base visual para publicar una página con recompensas, wallet digital, referidos y WhatsApp."
      />

      <TemplatesGallery />
    </div>
  )
}
