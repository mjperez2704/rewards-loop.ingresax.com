'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { desc, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { canAccessAdminPanel } from '@/lib/admin-access'
import { db } from '@/lib/db'
import {
  businessAccounts,
  businessModuleEntitlements,
  campaigns,
  clients,
  feedbackItems,
  rewards,
  supportTickets,
  transactions,
  user,
} from '@/lib/db/schema'
import {
  DEFAULT_SERVICE_ENTITLEMENTS,
  SERVICE_MODULES,
} from '@/lib/service-modules'
import type {
  ServiceEntitlements,
  ServiceModuleKey,
  SubscriptionStatus,
} from '@/lib/service-modules'

export type AdminBusinessAccount = {
  id: string
  ownerUserId: string
  businessName: string
  ownerName: string
  ownerEmail: string
  plan: 'Starter' | 'Growth' | 'Scale' | 'Enterprise'
  status: SubscriptionStatus
  mrr: number
  users: number
  locations: number
  customers: number
  rewardsIssued: number
  campaigns: number
  transactions: number
  serviceEntitlements: ServiceEntitlements
  billing: {
    nextInvoice: string | null
    unpaidAmount: number
    trialEndsAt?: string | null
  }
  health: {
    risk: 'low' | 'medium' | 'high'
    score: number
    reasons: string[]
    lastActivity: string
  }
  limits: {
    customers: { used: number; limit: number }
    campaigns: { used: number; limit: number }
    whatsapp: { used: number; limit: number }
    users: { used: number; limit: number }
  }
  moduleUsage: Partial<Record<ServiceModuleKey, string>>
}

export type AdminSupportTicket = {
  id: string
  account: string
  type: string
  subject: string
  priority: string
  status: string
  age: string
}

export type AdminFeedbackItem = {
  id: string
  account: string
  quote: string
  tag: string
  status: string
}

const PLAN_LIMITS: Record<AdminBusinessAccount['plan'], AdminBusinessAccount['limits']> = {
  Starter: {
    customers: { used: 0, limit: 1000 },
    campaigns: { used: 0, limit: 5 },
    whatsapp: { used: 0, limit: 5000 },
    users: { used: 1, limit: 3 },
  },
  Growth: {
    customers: { used: 0, limit: 5000 },
    campaigns: { used: 0, limit: 20 },
    whatsapp: { used: 0, limit: 25000 },
    users: { used: 1, limit: 8 },
  },
  Scale: {
    customers: { used: 0, limit: 15000 },
    campaigns: { used: 0, limit: 60 },
    whatsapp: { used: 0, limit: 100000 },
    users: { used: 1, limit: 25 },
  },
  Enterprise: {
    customers: { used: 0, limit: 1000000 },
    campaigns: { used: 0, limit: 1000000 },
    whatsapp: { used: 0, limit: 1000000 },
    users: { used: 1, limit: 1000000 },
  },
}

function parseOwnerAndBusiness(name?: string | null) {
  const safeName = name?.trim() || 'Usuario'
  const match = safeName.match(/^(.*?)\s+\((.*?)\)$/)

  return {
    ownerName: match?.[1]?.trim() || safeName,
    businessName: match?.[2]?.trim() || safeName,
  }
}

function normalizePlan(value: string): AdminBusinessAccount['plan'] {
  if (value === 'Growth' || value === 'Scale' || value === 'Enterprise') return value
  return 'Starter'
}

function normalizeStatus(value: string): SubscriptionStatus {
  if (value === 'trialing' || value === 'past_due' || value === 'paused') return value
  return 'active'
}

function cloneLimits(plan: AdminBusinessAccount['plan'], customers: number, campaignsCount: number) {
  const base = PLAN_LIMITS[plan]

  return {
    customers: { ...base.customers, used: customers },
    campaigns: { ...base.campaigns, used: campaignsCount },
    whatsapp: { ...base.whatsapp, used: 0 },
    users: { ...base.users, used: 1 },
  }
}

function ageFromDate(date: Date) {
  const diffMs = Date.now() - date.getTime()
  const hours = Math.max(Math.floor(diffMs / 36e5), 0)
  if (hours < 1) return 'Ahora'
  if (hours < 24) return `${hours} h`
  return `${Math.floor(hours / 24)} días`
}

async function requireAdminAccess() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || !(await canAccessAdminPanel(session.user.email))) {
    throw new Error('Unauthorized')
  }

  return session.user
}

export async function ensureProductionAccountTables() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "business_accounts" (
      "id" text PRIMARY KEY,
      "ownerUserId" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
      "businessName" text NOT NULL,
      "ownerName" text NOT NULL,
      "ownerEmail" text NOT NULL,
      "plan" text NOT NULL DEFAULT 'Starter',
      "status" text NOT NULL DEFAULT 'active',
      "mrr" integer NOT NULL DEFAULT 0,
      "locations" integer NOT NULL DEFAULT 1,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "business_module_entitlements" (
      "id" text PRIMARY KEY,
      "accountId" text NOT NULL REFERENCES "business_accounts"("id") ON DELETE CASCADE,
      "moduleKey" text NOT NULL,
      "enabled" boolean NOT NULL DEFAULT true,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)

  await db.execute(sql`
    CREATE UNIQUE INDEX IF NOT EXISTS "business_module_entitlements_account_module_idx"
    ON "business_module_entitlements" ("accountId", "moduleKey")
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "support_tickets" (
      "id" text PRIMARY KEY,
      "accountId" text REFERENCES "business_accounts"("id") ON DELETE SET NULL,
      "type" text NOT NULL DEFAULT 'Soporte',
      "subject" text NOT NULL,
      "priority" text NOT NULL DEFAULT 'Media',
      "status" text NOT NULL DEFAULT 'Abierto',
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "feedback_items" (
      "id" text PRIMARY KEY,
      "accountId" text REFERENCES "business_accounts"("id") ON DELETE SET NULL,
      "quote" text NOT NULL,
      "tag" text NOT NULL DEFAULT 'General',
      "status" text NOT NULL DEFAULT 'Recibido',
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)
}

export async function syncBusinessAccountsFromUsers() {
  await ensureProductionAccountTables()

  await db.execute(sql`
    INSERT INTO "business_accounts" (
      "id",
      "ownerUserId",
      "businessName",
      "ownerName",
      "ownerEmail",
      "plan",
      "status",
      "mrr",
      "locations",
      "createdAt",
      "updatedAt"
    )
    SELECT
      md5(random()::text || clock_timestamp()::text),
      "user"."id",
      COALESCE(NULLIF(regexp_replace(COALESCE("user"."name", "user"."email"), '^.*\\((.*)\\)$', '\\1'), COALESCE("user"."name", "user"."email")), COALESCE("user"."name", "user"."email")),
      COALESCE(NULLIF(regexp_replace(COALESCE("user"."name", "user"."email"), '^(.*) \\(.*\\)$', '\\1'), COALESCE("user"."name", "user"."email")), COALESCE("user"."name", "user"."email")),
      "user"."email",
      'Starter',
      'active',
      0,
      1,
      now(),
      now()
    FROM "user"
    WHERE NOT EXISTS (
      SELECT 1 FROM "business_accounts"
      WHERE "business_accounts"."ownerUserId" = "user"."id"
    )
  `)
}

export async function getAdminAccounts(): Promise<AdminBusinessAccount[]> {
  await requireAdminAccess()
  await syncBusinessAccountsFromUsers()

  const accountRows = await db.select().from(businessAccounts).orderBy(desc(businessAccounts.createdAt))
  const entitlementsRows = await db.select().from(businessModuleEntitlements)
  const clientRows = await db
    .select({ userId: clients.userId, count: sql<number>`count(*)::int` })
    .from(clients)
    .groupBy(clients.userId)
  const rewardRows = await db
    .select({ userId: rewards.userId, count: sql<number>`count(*)::int` })
    .from(rewards)
    .groupBy(rewards.userId)
  const campaignRows = await db
    .select({ userId: campaigns.userId, count: sql<number>`count(*)::int` })
    .from(campaigns)
    .groupBy(campaigns.userId)
  const transactionRows = await db
    .select({ userId: transactions.userId, count: sql<number>`count(*)::int`, points: sql<number>`COALESCE(sum(${transactions.amount}), 0)::int` })
    .from(transactions)
    .groupBy(transactions.userId)

  const byUser = <T extends { userId: string }>(rows: T[]) => new Map(rows.map((row) => [row.userId, row]))
  const clientsByUser = byUser(clientRows)
  const rewardsByUser = byUser(rewardRows)
  const campaignsByUser = byUser(campaignRows)
  const transactionsByUser = byUser(transactionRows)

  return accountRows.map((account) => {
    const plan = normalizePlan(account.plan)
    const status = normalizeStatus(account.status)
    const customers = clientsByUser.get(account.ownerUserId)?.count ?? 0
    const rewardsIssued = rewardsByUser.get(account.ownerUserId)?.count ?? 0
    const campaignsCount = campaignsByUser.get(account.ownerUserId)?.count ?? 0
    const transactionCount = transactionsByUser.get(account.ownerUserId)?.count ?? 0
    const points = Math.abs(transactionsByUser.get(account.ownerUserId)?.points ?? 0)
    const serviceEntitlements = { ...DEFAULT_SERVICE_ENTITLEMENTS }

    entitlementsRows
      .filter((row) => row.accountId === account.id)
      .forEach((row) => {
        if (SERVICE_MODULES.some((module) => module.key === row.moduleKey)) {
          serviceEntitlements[row.moduleKey as ServiceModuleKey] = row.enabled
        }
      })

    const lastActivity = account.updatedAt ? ageFromDate(account.updatedAt) : 'Sin actividad'
    const risk = status === 'past_due' ? 'high' : customers === 0 ? 'medium' : 'low'
    const reasons = status === 'past_due'
      ? ['Pago pendiente']
      : customers === 0
        ? ['Sin clientes registrados']
        : ['Uso real detectado']

    return {
      id: account.id,
      ownerUserId: account.ownerUserId,
      businessName: account.businessName,
      ownerName: account.ownerName,
      ownerEmail: account.ownerEmail,
      plan,
      status,
      mrr: account.mrr,
      users: 1,
      locations: account.locations,
      customers,
      rewardsIssued,
      campaigns: campaignsCount,
      transactions: transactionCount,
      serviceEntitlements,
      billing: {
        nextInvoice: null,
        unpaidAmount: status === 'past_due' ? account.mrr : 0,
        trialEndsAt: status === 'trialing' ? null : undefined,
      },
      health: {
        risk,
        score: risk === 'low' ? 90 : risk === 'medium' ? 60 : 30,
        reasons,
        lastActivity,
      },
      limits: cloneLimits(plan, customers, campaignsCount),
      moduleUsage: {
        clients: `${customers.toLocaleString()} perfiles`,
        rewards: `${rewardsIssued.toLocaleString()} recompensas`,
        campaigns: `${campaignsCount.toLocaleString()} campañas`,
        wallet: `${points.toLocaleString()} pts procesados`,
        operations: `${transactionCount.toLocaleString()} transacciones`,
      },
    }
  })
}

export async function getAdminOverviewData() {
  const accounts = await getAdminAccounts()
  const ticketRows = await db
    .select({
      id: supportTickets.id,
      type: supportTickets.type,
      subject: supportTickets.subject,
      priority: supportTickets.priority,
      status: supportTickets.status,
      createdAt: supportTickets.createdAt,
      accountName: businessAccounts.businessName,
    })
    .from(supportTickets)
    .leftJoin(businessAccounts, eq(supportTickets.accountId, businessAccounts.id))
    .orderBy(desc(supportTickets.createdAt))

  const feedbackRows = await db
    .select({
      id: feedbackItems.id,
      quote: feedbackItems.quote,
      tag: feedbackItems.tag,
      status: feedbackItems.status,
      accountName: businessAccounts.businessName,
    })
    .from(feedbackItems)
    .leftJoin(businessAccounts, eq(feedbackItems.accountId, businessAccounts.id))
    .orderBy(desc(feedbackItems.createdAt))

  return {
    accounts,
    tickets: ticketRows.map((ticket): AdminSupportTicket => ({
      id: ticket.id,
      account: ticket.accountName ?? 'Sin cuenta',
      type: ticket.type,
      subject: ticket.subject,
      priority: ticket.priority,
      status: ticket.status,
      age: ageFromDate(ticket.createdAt),
    })),
    feedback: feedbackRows.map((item): AdminFeedbackItem => ({
      id: item.id,
      account: item.accountName ?? 'Sin cuenta',
      quote: item.quote,
      tag: item.tag,
      status: item.status,
    })),
  }
}

export async function getBusinessAccountForUser(email: string) {
  await syncBusinessAccountsFromUsers()

  const [account] = await db
    .select()
    .from(businessAccounts)
    .where(eq(businessAccounts.ownerEmail, email))
    .limit(1)

  if (!account) {
    const [authUser] = await db.select().from(user).where(eq(user.email, email)).limit(1)
    const parsed = parseOwnerAndBusiness(authUser?.name ?? email)

    return {
      id: authUser?.id ?? email,
      businessName: parsed.businessName,
      serviceEntitlements: DEFAULT_SERVICE_ENTITLEMENTS,
    }
  }

  const entitlements = { ...DEFAULT_SERVICE_ENTITLEMENTS }
  const rows = await db
    .select()
    .from(businessModuleEntitlements)
    .where(eq(businessModuleEntitlements.accountId, account.id))

  rows.forEach((row) => {
    if (SERVICE_MODULES.some((module) => module.key === row.moduleKey)) {
      entitlements[row.moduleKey as ServiceModuleKey] = row.enabled
    }
  })

  return {
    id: account.id,
    businessName: account.businessName,
    serviceEntitlements: entitlements,
  }
}

export async function updateAccountModuleEntitlement(accountId: string, moduleKey: ServiceModuleKey, enabled: boolean) {
  await requireAdminAccess()
  await ensureProductionAccountTables()

  if (moduleKey === 'dashboard') return getAdminAccounts()

  await db.execute(sql`
    INSERT INTO "business_module_entitlements" (
      "id",
      "accountId",
      "moduleKey",
      "enabled",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${crypto.randomUUID()},
      ${accountId},
      ${moduleKey},
      ${enabled},
      now(),
      now()
    )
    ON CONFLICT ("accountId", "moduleKey")
    DO UPDATE SET "enabled" = ${enabled}, "updatedAt" = now()
  `)

  revalidatePath('/admin/services')
  revalidatePath('/dashboard')
  return getAdminAccounts()
}

export async function updateCurrentBusinessSettings(input: { businessName: string }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')

  await syncBusinessAccountsFromUsers()

  const businessName = input.businessName.trim()
  if (!businessName) throw new Error('Business name is required')

  const parsed = parseOwnerAndBusiness(session.user.name)

  await db
    .update(businessAccounts)
    .set({
      businessName,
      ownerName: parsed.ownerName,
      ownerEmail: session.user.email,
      updatedAt: new Date(),
    })
    .where(eq(businessAccounts.ownerUserId, session.user.id))

  revalidatePath('/dashboard/settings')
  revalidatePath('/admin')
}
