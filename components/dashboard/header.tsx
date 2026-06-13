'use client'

import { Bell, Search, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

interface User {
  id: string
  name?: string | null
  email: string
  image?: string | null
}

export function DashboardHeader({ user }: { user: User }) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border/80 bg-card/88 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-4 px-5 md:px-6">
        <div className="min-w-0 flex-1">
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes, recompensas, campañas..."
              className="h-10 rounded-lg border-border/70 bg-muted/55 pl-10 shadow-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden bg-background md:inline-flex" />
          <Button variant="outline" size="sm" className="hidden bg-background xl:inline-flex">
            <Sparkles className="size-4" />
            Plan premium
          </Button>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="size-4" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-brand-gold" />
          </Button>

          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <span className="text-xs font-semibold">
              {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
