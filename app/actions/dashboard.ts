'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { clients, rewards, campaigns, wallets, transactions } from '@/lib/db/schema'
import { and, desc, eq, sql } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

// Clients
export async function getClients() {
  const userId = await getUserId()
  return db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt))
}

export async function getClientById(id: string) {
  const userId = await getUserId()
  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, id), eq(clients.userId, userId)))
    .limit(1)

  return client || null
}

export async function createClient(data: { name: string; email: string; phone?: string; loyaltyTier?: string }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  const now = new Date()
  
  await db.insert(clients).values({
    id,
    userId,
    name: data.name,
    email: data.email,
    phone: data.phone || null,
    loyaltyTier: data.loyaltyTier || 'Oro',
    status: 'active',
    totalPoints: 0,
    createdAt: now,
    updatedAt: now,
  })
  
  revalidatePath('/dashboard/clients')
  return { id }
}

export async function deleteClient(id: string) {
  const userId = await getUserId()
  await db.delete(clients).where(and(eq(clients.id, id), eq(clients.userId, userId)))
  revalidatePath('/dashboard/clients')
}

// Rewards
export async function getRewards() {
  const userId = await getUserId()
  return db.select().from(rewards).where(eq(rewards.userId, userId)).orderBy(desc(rewards.createdAt))
}

export async function createReward(data: { title: string; description?: string; pointsRequired: number; category: string }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  const now = new Date()
  
  await db.insert(rewards).values({
    id,
    userId,
    title: data.title,
    description: data.description || null,
    pointsRequired: data.pointsRequired,
    category: data.category,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  })
  
  revalidatePath('/dashboard/rewards')
  return { id }
}

export async function deleteReward(id: string) {
  const userId = await getUserId()
  await db.delete(rewards).where(and(eq(rewards.id, id), eq(rewards.userId, userId)))
  revalidatePath('/dashboard/rewards')
}

// Campaigns
export async function getCampaigns() {
  const userId = await getUserId()
  return db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt))
}

export async function createCampaign(data: { name: string; description?: string; startDate: Date; endDate: Date; pointsMultiplier?: number }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  const now = new Date()
  
  await db.insert(campaigns).values({
    id,
    userId,
    name: data.name,
    description: data.description || null,
    startDate: data.startDate,
    endDate: data.endDate,
    pointsMultiplier: data.pointsMultiplier || 1.0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  })
  
  revalidatePath('/dashboard/campaigns')
  return { id }
}

export async function deleteCampaign(id: string) {
  const userId = await getUserId()
  await db.delete(campaigns).where(and(eq(campaigns.id, id), eq(campaigns.userId, userId)))
  revalidatePath('/dashboard/campaigns')
}

// Wallets
export async function getWallets() {
  const userId = await getUserId()
  return db.select().from(wallets).where(eq(wallets.userId, userId)).orderBy(desc(wallets.createdAt))
}

export async function createWallet(data: { clientId?: string; balance?: number }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  const now = new Date()
  
  await db.insert(wallets).values({
    id,
    userId,
    clientId: data.clientId || null,
    balance: data.balance || 0,
    currency: 'points',
    createdAt: now,
    updatedAt: now,
  })
  
  revalidatePath('/dashboard/wallet')
  return { id }
}

// Transactions
export async function getTransactions() {
  const userId = await getUserId()
  return db.select().from(transactions).where(eq(transactions.userId, userId)).orderBy(desc(transactions.createdAt))
}

export async function createTransaction(data: { walletId?: string; amount: number; type: string; description?: string }) {
  const userId = await getUserId()
  const id = crypto.randomUUID()
  const now = new Date()
  
  await db.insert(transactions).values({
    id,
    userId,
    walletId: data.walletId || null,
    amount: data.amount,
    type: data.type,
    description: data.description || null,
    createdAt: now,
  })
  
  revalidatePath('/dashboard/wallet')
  return { id }
}

// Dashboard Stats
export async function getDashboardStats() {
  const userId = await getUserId()
  
  const [clientsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(clients)
    .where(eq(clients.userId, userId))

  const [activeClientsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(clients)
    .where(and(eq(clients.userId, userId), eq(clients.status, 'active')))
  
  const [rewardsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rewards)
    .where(eq(rewards.userId, userId))
  
  const [campaignsCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
  
  const [totalPoints] = await db
    .select({ sum: sql<number>`COALESCE(SUM("totalPoints"), 0)::int` })
    .from(clients)
    .where(eq(clients.userId, userId))

  const [issuedTransactions] = await db
    .select({
      count: sql<number>`count(*)::int`,
      sum: sql<number>`COALESCE(SUM("amount"), 0)::int`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, 'credit')))

  const [redeemedTransactions] = await db
    .select({
      count: sql<number>`count(*)::int`,
      sum: sql<number>`COALESCE(SUM("amount"), 0)::int`,
    })
    .from(transactions)
    .where(and(eq(transactions.userId, userId), eq(transactions.type, 'debit')))

  const totalClients = clientsCount?.count || 0
  const activeClients = activeClientsCount?.count || 0

  return {
    totalClients,
    activeClients,
    totalRewards: rewardsCount?.count || 0,
    activeCampaigns: campaignsCount?.count || 0,
    totalPoints: totalPoints?.sum || 0,
    rewardsIssued: issuedTransactions?.count || 0,
    rewardsRedeemed: redeemedTransactions?.count || 0,
    pointsIssued: issuedTransactions?.sum || 0,
    pointsRedeemed: Math.abs(redeemedTransactions?.sum || 0),
    attributedSales: issuedTransactions?.sum || 0,
    returnRate: totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0,
  }
}
