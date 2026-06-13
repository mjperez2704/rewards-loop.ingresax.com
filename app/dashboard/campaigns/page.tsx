import { getCampaigns } from '@/app/actions/dashboard'
import { CampaignsList } from '@/components/dashboard/campaigns-list'
import { AddCampaignDialog } from '@/components/dashboard/add-campaign-dialog'
import { CampaignBuilder } from '@/components/dashboard/campaign-builder'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Campañas"
        title="Creador de campaña"
        description="Diseña campañas con segmento, WhatsApp, fechas, recompensa y vista previa."
        actions={<AddCampaignDialog />}
      />

      <CampaignBuilder />

      <CampaignsList campaigns={campaigns} />
    </div>
  )
}
