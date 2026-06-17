import { getClients, getRewards, getWallets } from '@/app/actions/dashboard'
import { EmployeeOperationsPage } from '@/components/dashboard/employee-operations-page'

export default async function OperationsRoute() {
  const [clients, rewards, wallets] = await Promise.all([
    getClients(),
    getRewards(),
    getWallets(),
  ])

  return <EmployeeOperationsPage clients={clients} rewards={rewards} wallets={wallets} />
}
