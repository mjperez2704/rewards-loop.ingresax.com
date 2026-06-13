import {
  BarChart3,
  Building2,
  ClipboardCheck,
  CreditCard,
  Database,
  Gift,
  Globe,
  LayoutDashboard,
  Megaphone,
  MessageCircle,
  QrCode,
  Settings,
  Share2,
  ShieldCheck,
  Store,
  Users,
  Wallet,
} from 'lucide-react'
import {
  SERVICE_MODULES,
  mergeServiceEntitlements,
} from '@/lib/service-modules'
import type { AdminBusinessAccount, AdminSupportTicket } from '@/app/actions/admin-accounts'
import type { ServiceModuleKey, SubscriptionStatus } from '@/lib/service-modules'
import { getPermissionsForRole } from '@/lib/admin-roles'

export interface AdminUser {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

export const adminNavigation = [
  { label: 'Resumen maestro', href: '/admin', icon: LayoutDashboard },
  { label: 'Cuentas SaaS', href: '/admin/accounts', icon: Building2 },
  { label: 'Microservicios', href: '/admin/services', icon: Database },
  { label: 'Planes y límites', href: '/admin/plans', icon: CreditCard },
  { label: 'Usuarios y roles', href: '/admin/users', icon: ShieldCheck },
]

export const moduleIcons: Record<ServiceModuleKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  clients: Users,
  rewards: Gift,
  campaigns: Megaphone,
  templates: Globe,
  wallet: Wallet,
  referrals: Share2,
  whatsapp: MessageCircle,
  industries: Store,
  reports: BarChart3,
  operations: ClipboardCheck,
  customerPortal: QrCode,
  settings: Settings,
}

export const statusCopy: Record<SubscriptionStatus, { label: string; className: string }> = {
  active: { label: 'Activa', className: 'status-success' },
  trialing: { label: 'Prueba', className: 'status-brand' },
  past_due: { label: 'Pago pendiente', className: 'status-warning' },
  paused: { label: 'Pausada', className: 'status-muted' },
}

export const planDisplayNames: Record<string, string> = {
  Starter: 'Inicial',
  Growth: 'Crecimiento',
  Scale: 'Escala',
  Enterprise: 'Empresarial',
}

export const plans = [
  { id: 'Starter', name: 'Inicial', price: '$49', accounts: '1 sucursal', customers: '1,000 clientes', modules: '6 microservicios' },
  { id: 'Growth', name: 'Crecimiento', price: '$129', accounts: '3 sucursales', customers: '5,000 clientes', modules: '9 microservicios' },
  { id: 'Scale', name: 'Escala', price: '$249', accounts: '10 sucursales', customers: '15,000 clientes', modules: 'Todos + reportes' },
  { id: 'Enterprise', name: 'Empresarial', price: 'Personalizado', accounts: 'Multi-marca', customers: 'Ilimitado', modules: 'SLA + soporte' },
]

export const adminUsers = [
  {
    id: 'admin-1',
    name: 'Administrador principal',
    email: 'admin@ingresax.com',
    role: 'Super admin',
    status: 'Activo',
    permissions: getPermissionsForRole('Super admin'),
  },
  {
    id: 'admin-2',
    name: 'Soporte SaaS',
    email: 'soporte@ingresax.com',
    role: 'Soporte',
    status: 'Invitado',
    permissions: getPermissionsForRole('Soporte'),
  },
]

export function planName(value: string) {
  return planDisplayNames[value] ?? value
}

export function money(value: number) {
  return `$${value.toLocaleString()}`
}

export function usagePercent(used: number, limit: number) {
  return Math.min(Math.round((used / limit) * 100), 100)
}

export function getAdminSummary(
  accounts: AdminBusinessAccount[],
  tickets: AdminSupportTicket[] = [],
  storedEntitlements: Record<string, unknown> = {},
) {
  const activeAccounts = accounts.filter((account) => account.status === 'active')
  const mrr = activeAccounts.reduce((total, account) => total + account.mrr, 0)
  const customers = accounts.reduce((total, account) => total + account.customers, 0)
  const enabledModules = accounts.reduce((total, account) => {
    const accountStored = storedEntitlements[account.id] && typeof storedEntitlements[account.id] === 'object'
      ? storedEntitlements[account.id] as Partial<Record<ServiceModuleKey, boolean>>
      : {}
    const entitlements = mergeServiceEntitlements({
      ...account.serviceEntitlements,
      ...accountStored,
    })

    return total + SERVICE_MODULES.filter((module) => entitlements[module.key]).length
  }, 0)

  return {
    accounts: accounts.length,
    activeAccounts: activeAccounts.length,
    mrr,
    customers,
    enabledModules,
    pendingAccounts: accounts.filter((account) => account.status === 'past_due').length,
    trialAccounts: accounts.filter((account) => account.status === 'trialing').length,
    unpaidMrr: accounts.reduce((total, account) => total + account.billing.unpaidAmount, 0),
    openTickets: tickets.filter((ticket) => ticket.status !== 'Cerrado').length,
    atRiskAccounts: accounts.filter((account) => account.health.risk !== 'low').length,
  }
}
