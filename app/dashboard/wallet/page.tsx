import { getWallets, getTransactions } from '@/app/actions/dashboard'
import { WalletOverview } from '@/components/dashboard/wallet-overview'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { DigitalWalletCard } from '@/components/dashboard/digital-wallet-card'
import { DashboardPageHeader } from '@/components/dashboard/page-header'

export default async function WalletPage() {
  const [wallets, transactions] = await Promise.all([
    getWallets(),
    getTransactions(),
  ])

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0)

  return (
    <div className="product-shell">
      <DashboardPageHeader
        eyebrow="Wallet digital"
        title="Wallet digital"
        description="Tarjetas tipo Apple Wallet / Google Wallet para clientes, puntos y QR."
      />

      <DigitalWalletCard wallet={wallets[0]} />

      <WalletOverview totalBalance={totalBalance} walletsCount={wallets.length} />

      <TransactionsList transactions={transactions} />
    </div>
  )
}
