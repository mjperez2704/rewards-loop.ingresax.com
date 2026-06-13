import { getRewards } from '@/app/actions/dashboard'
import { RewardsGrid } from '@/components/dashboard/rewards-grid'
import { AddRewardDialog } from '@/components/dashboard/add-reward-dialog'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function RewardsPage() {
  const rewards = await getRewards()

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Recompensas"
        title="Módulo de recompensas"
        description="Administra puntos, cupones, cashback, sellos, cumpleaños, referidos y membresías VIP."
        actions={<AddRewardDialog />}
      />

      <RewardsGrid rewards={rewards} />
    </div>
  )
}
