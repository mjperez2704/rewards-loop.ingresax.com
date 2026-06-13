'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { Eye, LayoutDashboard, LogOut, X } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'
import { Button } from '@/components/ui/button'
import { adminNavigation } from '@/components/admin/admin-utils'
import type { AdminUser } from '@/components/admin/admin-utils'

const pageCopy: Record<string, { eyebrow: string; title: string }> = {
  '/admin': { eyebrow: 'Administración SaaS', title: 'Resumen maestro' },
  '/admin/accounts': { eyebrow: 'Administración SaaS', title: 'Cuentas SaaS' },
  '/admin/services': { eyebrow: 'Administración SaaS', title: 'Microservicios' },
  '/admin/plans': { eyebrow: 'Administración SaaS', title: 'Planes y límites' },
  '/admin/users': { eyebrow: 'Administración SaaS', title: 'Usuarios y roles' },
  '/admin/business-preview': { eyebrow: 'Vista muestra', title: 'Panel muestra del negocio' },
}

export function AdminShell({ user, children }: { user: AdminUser; children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentPage = useMemo(() => pageCopy[pathname] ?? pageCopy['/admin'], [pathname])

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center border-b border-border/80 px-5">
        <Link href="/admin" className="flex items-center" onClick={() => setMobileOpen(false)}>
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
        {adminNavigation.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <item.icon className="size-4" strokeWidth={1.5} />
              <span className="min-w-0">
                <span className="block leading-4">{item.label}</span>
              </span>
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border/80 p-4">
        <div className="rounded-lg border border-border/70 bg-muted/45 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Administrador maestro</p>
          <p className="mt-2 truncate text-sm font-semibold">{user.name || 'Administrador SaaS'}</p>
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
    <div className="min-h-screen bg-background text-foreground">
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

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/88 backdrop-blur-xl">
          <div className="flex min-h-16 flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="product-kicker">{currentPage.eyebrow}</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal">{currentPage.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSwitcher className="bg-background" />
              <Button asChild variant="outline" className="bg-background">
                <Link href="/admin/business-preview">
                  <Eye className="size-4" />
                  Vista muestra
                </Link>
              </Button>
              <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xs font-semibold">{user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 md:px-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
