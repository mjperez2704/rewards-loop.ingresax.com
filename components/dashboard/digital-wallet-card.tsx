'use client'

import Image from 'next/image'
import { QrCode, Smartphone, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

type WalletRecord = {
  id: string
  clientId: string | null
  balance: number
  currency: string
}

export function DigitalWalletCard({ wallet }: { wallet?: WalletRecord }) {
  const [status, setStatus] = useState('')

  const handleAddToWallet = () => {
    if (!wallet) return

    const passPayload = {
      formatVersion: 1,
      passTypeIdentifier: 'pass.com.ingresax.rewards',
      serialNumber: wallet.id,
      organizationName: 'INGRESAX REWARDS',
      description: 'Pase digital de recompensas INGRESAX',
      businessName: 'INGRESAX REWARDS',
      customerName: wallet.clientId ?? 'Cliente sin vincular',
      tier: 'Sin nivel',
      points: wallet.balance,
      qrValue: `INGRESAX:WALLET:${wallet.id}`,
      note: 'Pase digital de recompensas para clientes.',
    }

    const blob = new Blob([JSON.stringify(passPayload, null, 2)], {
      type: 'application/vnd.apple.pkpass',
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ingresax-rewards.pkpass'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setStatus('Pase digital descargado.')
  }

  const handleDownloadQr = () => {
    if (!wallet) return

    const qrText = `INGRESAX:WALLET:${wallet.id}`
    const blob = new Blob([qrText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'ingresax-wallet-qr.txt'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
    setStatus('Código QR descargado.')
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="premium-card p-6">
        <div className="mx-auto max-w-sm rounded-[28px] bg-primary p-5 text-primary-foreground shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between">
            <Image src="/logo_horizontal_2.png" alt="INGRESAX REWARDS" width={180} height={36} className="h-auto w-36 brightness-0 invert" />
            <Wallet className="size-6 text-brand-gold" />
          </div>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-[0.18em] text-white/45">Nombre del negocio</p>
            <h2 className="mt-2 text-2xl font-semibold">INGRESAX REWARDS</h2>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/45">Cliente</p>
              <p className="mt-1 font-semibold">{wallet?.clientId ?? 'Sin wallet emitida'}</p>
            </div>
            <div>
              <p className="text-xs text-white/45">Nivel</p>
              <p className="mt-1 font-semibold text-brand-gold">Sin nivel</p>
            </div>
          </div>
          <div className="mt-8 rounded-lg bg-white p-4 text-black">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-black/45">Puntos disponibles</p>
                <p className="mt-1 text-4xl font-semibold tracking-normal">{wallet?.balance.toLocaleString() ?? '0'}</p>
              </div>
              <div className="grid size-20 grid-cols-5 gap-1 rounded-lg bg-white p-2">
                {Array.from({ length: 25 }).map((_, index) => (
                  <span key={index} className={index % 3 === 0 || index % 7 === 0 ? 'rounded-[2px] bg-black' : 'rounded-[2px] bg-black/10'} />
                ))}
              </div>
            </div>
          </div>
          <p className="mt-5 text-center text-xs text-white/45">Listo para Wallet</p>
        </div>
      </Card>

      <Card className="premium-card p-6">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Wallet digital</h2>
            <p className="text-sm text-muted-foreground">Tarjeta lista para el teléfono del cliente</p>
          </div>
          <Smartphone className="size-6 text-brand-teal" />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Negocio', 'INGRESAX REWARDS'],
            ['Cliente', wallet?.clientId ?? 'Sin vincular'],
            ['Nivel', 'Sin nivel'],
            ['Puntos', `${wallet?.balance.toLocaleString() ?? '0'} pts`],
            ['Código QR', wallet ? 'Activo' : 'Sin emitir'],
            ['Estado', wallet ? 'Sincronizado' : 'Pendiente'],
          ].map(([label, value]) => (
            <div key={label} className="premium-card-muted p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {status && <p className="mt-6 rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{status}</p>}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={handleAddToWallet} disabled={!wallet} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Wallet className="size-4" />
            Agregar a Wallet
          </Button>
          <Button onClick={handleDownloadQr} disabled={!wallet} variant="outline" className="bg-background">
            <QrCode className="size-4" />
            Descargar QR
          </Button>
        </div>
      </Card>
    </div>
  )
}
