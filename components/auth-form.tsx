'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { LanguageSwitcher } from '@/components/i18n/language-switcher'

export function AuthForm({
  mode,
  redirectTo = '/dashboard',
  heading,
  subheading,
  showModeLink = true,
}: {
  mode: 'sign-in' | 'sign-up'
  redirectTo?: string
  heading?: string
  subheading?: string
  showModeLink?: boolean
}) {
  const router = useRouter()
  const [businessName, setBusinessName] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fullName = isSignUp ? `${name} (${businessName})` : name

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name: fullName })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? 'Algo salió mal')
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-background px-4">
      <div className="fixed right-4 top-4">
        <LanguageSwitcher className="bg-background" />
      </div>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <div className="mb-2 flex items-center justify-center gap-1">
              <Image
                src="/logo_horizontal_2.png"
                alt="INGRESAX REWARDS"
                width={220}
                height={44}
                priority
                className="h-10 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        <div className="premium-card p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {heading ?? (isSignUp ? 'Registra tu negocio' : 'Bienvenido de vuelta')}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {subheading ?? (isSignUp
                ? 'Crea tu programa de fidelización'
                : 'Inicia sesión en tu cuenta')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="businessName" className="text-sm font-medium">Nombre del negocio</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    required
                    autoComplete="organization"
                    className="h-11 rounded-lg"
                    placeholder="Mi Restaurante, Spa Wellness, etc."
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-sm font-medium">Tu nombre</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="h-11 rounded-lg"
                    placeholder="Tu nombre completo"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="h-11 rounded-lg"
                placeholder="correo@negocio.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                className="h-11 rounded-lg"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-2 h-11 w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loading
                ? 'Por favor espera...'
                : isSignUp
                  ? 'Crear mi programa'
                  : 'Iniciar sesión'}
            </Button>
          </form>

          {isSignUp && (
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Al registrarte aceptas nuestros términos de servicio y política de privacidad.
            </p>
          )}

          {showModeLink && (
            <p className="mt-6 text-center text-sm text-muted-foreground">
              {isSignUp ? '¿Ya tienes cuenta? ' : '¿No tienes cuenta? '}
              <Link
                href={isSignUp ? '/sign-in' : '/sign-up'}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {isSignUp ? 'Inicia sesión' : 'Registra tu negocio'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
