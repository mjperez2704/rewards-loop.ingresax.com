import { NextResponse } from 'next/server'
import { and, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients, transactions, wallets } from '@/lib/db/schema'
import { mobileUnauthorizedResponse } from '@/lib/mobile-api-auth'

type MobileTransactionInput = {
  clientId?: string
  amount?: number
  type?: 'credit' | 'debit'
  description?: string
}

export async function POST(request: Request) {
  const unauthorized = mobileUnauthorizedResponse(request)
  if (unauthorized) return unauthorized

  let input: MobileTransactionInput

  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const clientId = input.clientId?.trim()
  const amount = Math.round(Number(input.amount ?? 0))
  const type = input.type

  if (!clientId) return NextResponse.json({ error: 'clientId is required.' }, { status: 400 })
  if (type !== 'credit' && type !== 'debit') {
    return NextResponse.json({ error: 'type must be credit or debit.' }, { status: 400 })
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'amount must be greater than zero.' }, { status: 400 })
  }

  try {
    const result = await db.transaction(async (tx) => {
      const [client] = await tx
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1)

      if (!client) throw new Error('Client not found.')
      if (type === 'debit' && client.totalPoints < amount) {
        throw new Error('Insufficient points.')
      }

      let [wallet] = await tx
        .select()
        .from(wallets)
        .where(and(eq(wallets.clientId, client.id), eq(wallets.userId, client.userId)))
        .limit(1)

      if (!wallet) {
        const [createdWallet] = await tx
          .insert(wallets)
          .values({
            id: crypto.randomUUID(),
            userId: client.userId,
            clientId: client.id,
            balance: client.totalPoints,
            currency: 'points',
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .returning()
        wallet = createdWallet
      }

      await tx
        .update(clients)
        .set({
          totalPoints: type === 'credit'
            ? sql`${clients.totalPoints} + ${amount}`
            : sql`GREATEST(${clients.totalPoints} - ${amount}, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(clients.id, client.id))

      await tx
        .update(wallets)
        .set({
          balance: type === 'credit'
            ? sql`${wallets.balance} + ${amount}`
            : sql`GREATEST(${wallets.balance} - ${amount}, 0)`,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id))

      const [transaction] = await tx
        .insert(transactions)
        .values({
          id: crypto.randomUUID(),
          userId: client.userId,
          walletId: wallet.id,
          amount,
          type,
          description: input.description?.trim() || `Mobile API ${type}`,
          createdAt: new Date(),
        })
        .returning()

      const [updatedClient] = await tx
        .select()
        .from(clients)
        .where(eq(clients.id, client.id))
        .limit(1)

      const [updatedWallet] = await tx
        .select()
        .from(wallets)
        .where(eq(wallets.id, wallet.id))
        .limit(1)

      return { client: updatedClient, wallet: updatedWallet, transaction }
    })

    return NextResponse.json(result)
  } catch (caught) {
    return NextResponse.json(
      { error: caught instanceof Error ? caught.message : 'Transaction failed.' },
      { status: 400 },
    )
  }
}
