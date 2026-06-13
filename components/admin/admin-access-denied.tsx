'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LockKeyhole, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'

export function AdminAccessDenied({ email }: { email: string }) {
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-center shadow-sm">
        <Image
          src="/logo_vertical.png"
          alt="INGRESAX REWARDS"
          width={160}
          height={160}
          priority
          className="mx-auto h-24 w-auto object-contain"
        />
        <div className="mx-auto mt-6 flex size-12 items-center justify-center rounded-lg bg-muted">
          <LockKeyhole className="size-6 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-normal">Acceso maestro restringido</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          La cuenta {email} inició sesión correctamente, pero no está autorizada para administrar cuentas SaaS,
          suscripciones ni microservicios.
        </p>
        <div className="mt-6 grid gap-2">
          <Button asChild>
            <Link href="/dashboard">Volver al panel del negocio</Link>
          </Button>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="size-4" />
            Cerrar sesión e intentar otra cuenta
          </Button>
        </div>
      </div>
    </main>
  )
}
