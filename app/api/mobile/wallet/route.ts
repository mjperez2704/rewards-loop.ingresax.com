import { NextResponse } from 'next/server'
import { and, desc, eq, or } from 'drizzle-orm'
import { db } from '@/lib/db'
import { clients, rewards, transactions, wallets } from '@/lib/db/schema'
import { mobileUnauthorizedResponse } from '@/lib/mobile-api-auth'

export async function GET(request: Request) {
  const unauthorized = mobileUnauthorizedResponse(request)
  if (unauthorized) return unauthorized

  const url = new URL(request.url)
  const clientId = url.searchParams.get('clientId')?.trim()
  const email = url.searchParams.get('email')?.trim().toLowerCase()
  const phone = url.searchParams.get('phone')?.trim()

  if (!clientId && !email && !phone) {
    return NextResponse.json(
      { error: 'clientId, email or phone is required.' },
      { status: 400 },
    )
  }

  const conditions = [
    clientId ? eq(clients.id, clientId) : undefined,
    email ? eq(clients.email, email) : undefined,
    phone ? eq(clients.phone, phone) : undefined,
  ].filter(Boolean)

  const [client] = await db
    .select()
    .from(clients)
    .where(or(...conditions))
    .limit(1)

  if (!client) {
    return NextResponse.json({ error: 'Client not found.' }, { status: 404 })
  }

  const [wallet] = await db
    .select()
    .from(wallets)
    .where(and(eq(wallets.clientId, client.id), eq(wallets.userId, client.userId)))
    .limit(1)

  const activeRewards = await db
    .select()
    .from(rewards)
    .where(and(eq(rewards.userId, client.userId), eq(rewards.status, 'active')))
    .orderBy(rewards.pointsRequired)

  const recentTransactions = wallet
    ? await db
      .select()
      .from(transactions)
      .where(and(eq(transactions.userId, client.userId), eq(transactions.walletId, wallet.id)))
      .orderBy(desc(transactions.createdAt))
      .limit(20)
    : []

  return NextResponse.json({
    client: {
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      loyaltyTier: client.loyaltyTier,
      totalPoints: client.totalPoints,
      updatedAt: client.updatedAt,
    },
    wallet: {
      id: wallet?.id ?? null,
      balance: wallet?.balance ?? client.totalPoints,
      currency: wallet?.currency ?? 'points',
      updatedAt: wallet?.updatedAt ?? client.updatedAt,
    },
    rewards: activeRewards.map((reward) => ({
      id: reward.id,
      title: reward.title,
      description: reward.description,
      category: reward.category,
      pointsRequired: reward.pointsRequired,
    })),
    transactions: recentTransactions.map((transaction) => ({
      id: transaction.id,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      createdAt: transaction.createdAt,
    })),
  })
}
