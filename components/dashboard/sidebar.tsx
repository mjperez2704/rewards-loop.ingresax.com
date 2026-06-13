'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  BarChart3,
  ClipboardCheck,
  Gift,
  LayoutDashboard,
  Lock,
  LogOut,
  Megaphone,
  MessageCircle,
  Globe,
  QrCode,
  Settings,
  Share2,
  Store,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { SERVICE_MODULES } from '@/lib/service-modules'
import type { ServiceEntitlements, ServiceModuleKey } from '@/lib/service-modules'

interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

const moduleIcons: Record<ServiceModuleKey, typeof LayoutDashboard> = {
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

const navigation = SERVICE_MODULES.map((module) => ({
  ...module,
  icon: moduleIcons[module.key],
}))

export function DashboardSidebar({
  user,
  entitlements,
}: {
  user: User
  entitlements: ServiceEntitlements
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center border-b border-border/80 px-5">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo_horizontal_2.png"
            alt="INGRESAX REWARDS"
            width={210}
            height={42}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const isEnabled = entitlements[item.key]

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-disabled={!isEnabled}
              onClick={(event) => {
                if (!isEnabled) {
                  event.preventDefault()
                  return
                }

                setMobileOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                !isEnabled && 'cursor-not-allowed opacity-45 hover:bg-transparent hover:text-muted-foreground',
              )}
            >
              <item.icon className="size-4" strokeWidth={1.5} />
              <span className="min-w-0">
                <span className="block leading-4">{item.name}</span>
              </span>
              {!isEnabled && <Lock className="ml-auto size-3.5" strokeWidth={1.5} />}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/80 p-4">
        <div className="rounded-lg border border-border/70 bg-muted/45 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Espacio de trabajo</p>
          <p className="mt-2 truncate text-sm font-semibold">{user.name || 'Administrador INGRESAX'}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </>
  )

  return (
    <>
      <aside className="fixed inset-y-0 hidden w-72 flex-col border-r border-border/80 bg-sidebar lg:flex">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 flex w-72 flex-col border-r border-border bg-sidebar">
            <div className="absolute right-4 top-5">
              <Button variant="ghost" size="icon-sm" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      <button
        className="fixed bottom-4 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir navegación"
      >
        <LayoutDashboard className="size-5" />
      </button>
    </>
  )
}
