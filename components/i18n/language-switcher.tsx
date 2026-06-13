'use client'

import { useEffect, useState } from 'react'
import { Globe2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LOCALE_COOKIE_KEY, LOCALE_STORAGE_KEY } from '@/components/i18n/language-runtime'
import type { Locale } from '@/components/i18n/language-runtime'

function readLocale(): Locale {
  if (typeof window === 'undefined') return 'es'

  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored

  const cookieLocale = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${LOCALE_COOKIE_KEY}=`))
    ?.split('=')[1]

  return cookieLocale === 'en' ? 'en' : 'es'
}

function writeLocale(locale: Locale) {
  window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  document.cookie = `${LOCALE_COOKIE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`
  window.dispatchEvent(new Event('ingresax:locale-change'))
}

export function LanguageSwitcher({ className }: { className?: string }) {
  const [locale, setLocale] = useState<Locale>('es')

  useEffect(() => {
    setLocale(readLocale())
  }, [])

  const nextLocale = locale === 'es' ? 'en' : 'es'

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={className}
      onClick={() => {
        setLocale(nextLocale)
        writeLocale(nextLocale)
      }}
      aria-label="Cambiar idioma"
    >
      <Globe2 className="size-4" />
      {locale.toUpperCase()}
    </Button>
  )
}
