export type ServiceModuleKey =
  | 'dashboard'
  | 'clients'
  | 'rewards'
  | 'campaigns'
  | 'templates'
  | 'wallet'
  | 'referrals'
  | 'whatsapp'
  | 'industries'
  | 'reports'
  | 'operations'
  | 'customerPortal'
  | 'settings'

export type ServiceEntitlements = Record<ServiceModuleKey, boolean>

export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'paused'

export type MasterAccount = {
  id: string
  businessName: string
  ownerName: string
  ownerEmail: string
  plan: 'Starter' | 'Growth' | 'Scale' | 'Enterprise'
  status: SubscriptionStatus
  mrr: number
  users: number
  locations: number
  customers: number
  rewardsIssued: number
  serviceEntitlements: Partial<ServiceEntitlements>
  limits: {
    customers: { used: number; limit: number }
    campaigns: { used: number; limit: number }
    whatsapp: { used: number; limit: number }
    users: { used: number; limit: number }
  }
  health: {
    risk: 'low' | 'medium' | 'high'
    score: number
    reasons: string[]
    lastActivity: string
  }
  billing: {
    nextInvoice: string
    unpaidAmount: number
    trialEndsAt?: string
  }
  moduleUsage: Partial<Record<ServiceModuleKey, string>>
}

export const SERVICE_ENTITLEMENTS_STORAGE_KEY = 'ingresax.serviceEntitlements.v1'

export const SERVICE_MODULES: Array<{
  key: ServiceModuleKey
  name: string
  href: string
  description: string
  category: 'Principal' | 'Crecimiento' | 'Marketing' | 'Operación'
}> = [
  {
    key: 'dashboard',
    name: 'Panel principal',
    href: '/dashboard',
    description: 'Métricas principales, actividad reciente y crecimiento mensual.',
    category: 'Principal',
  },
  {
    key: 'clients',
    name: 'Clientes',
    href: '/dashboard/clients',
    description: 'Base de clientes, puntos, niveles, estados y perfiles individuales.',
    category: 'Operación',
  },
  {
    key: 'rewards',
    name: 'Recompensas',
    href: '/dashboard/rewards',
    description: 'Puntos, cupones, cashback, sellos, cumpleaños, referidos y VIP.',
    category: 'Crecimiento',
  },
  {
    key: 'campaigns',
    name: 'Campañas',
    href: '/dashboard/campaigns',
    description: 'Creador de campañas, segmentos, fechas y mensajes de WhatsApp.',
    category: 'Marketing',
  },
  {
    key: 'templates',
    name: 'Página pública',
    href: '/dashboard/templates',
    description: 'Plantillas para que cada negocio publique su propia página.',
    category: 'Marketing',
  },
  {
    key: 'wallet',
    name: 'Wallet',
    href: '/dashboard/wallet',
    description: 'Tarjeta digital, puntos, QR y botón para agregar a Wallet.',
    category: 'Crecimiento',
  },
  {
    key: 'referrals',
    name: 'Referidos',
    href: '/dashboard/referrals',
    description: 'Programas de recomendación, embajadores y recompensas por referido.',
    category: 'Crecimiento',
  },
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    href: '/dashboard/whatsapp',
    description: 'Plantillas, campañas y mensajes automatizados por WhatsApp.',
    category: 'Marketing',
  },
  {
    key: 'industries',
    name: 'Industrias',
    href: '/dashboard/industries',
    description: 'Beneficios sugeridos por barberías, restaurantes, clínicas y más.',
    category: 'Operación',
  },
  {
    key: 'reports',
    name: 'Reportes',
    href: '/dashboard/reports',
    description: 'Análisis de rendimiento, ventas atribuidas y retorno.',
    category: 'Operación',
  },
  {
    key: 'operations',
    name: 'Operación POS',
    href: '/dashboard/operations',
    description: 'Registro rápido, escaneo QR, puntos, canjes y búsqueda para empleados.',
    category: 'Operación',
  },
  {
    key: 'customerPortal',
    name: 'Portal cliente',
    href: '/dashboard/customer-portal',
    description: 'Experiencia del cliente final: registro, wallet, recompensas y referidos.',
    category: 'Crecimiento',
  },
  {
    key: 'settings',
    name: 'Configuración',
    href: '/dashboard/settings',
    description: 'Marca, sucursales, roles, integraciones, sitio web y wallet.',
    category: 'Principal',
  },
]

export const DEFAULT_SERVICE_ENTITLEMENTS = SERVICE_MODULES.reduce((acc, module) => {
  acc[module.key] = true
  return acc
}, {} as ServiceEntitlements)

export function mergeServiceEntitlements(overrides?: Partial<ServiceEntitlements>): ServiceEntitlements {
  return {
    ...DEFAULT_SERVICE_ENTITLEMENTS,
    ...overrides,
    dashboard: true,
  }
}

export function getServiceModuleByPath(pathname: string) {
  return (
    SERVICE_MODULES.find((module) => {
      if (module.href === '/dashboard') return pathname === '/dashboard'
      return pathname === module.href || pathname.startsWith(`${module.href}/`)
    }) ?? SERVICE_MODULES[0]
  )
}
