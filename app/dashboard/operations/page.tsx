import { getClients, getRewards } from '@/app/actions/dashboard'
import { EmployeeOperationsPage } from '@/components/dashboard/employee-operations-page'

export default async function OperationsRoute() {
  const [clients, rewards] = await Promise.all([
    getClients(),
    getRewards(),
  ])

  return <EmployeeOperationsPage clients={clients} rewards={rewards} />
}
