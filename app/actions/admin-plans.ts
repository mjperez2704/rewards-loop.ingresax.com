'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { canAccessAdminPanel } from '@/lib/admin-access'
import { db } from '@/lib/db'
import { businessAccounts, businessModuleEntitlements, servicePlans } from '@/lib/db/schema'
import { SERVICE_MODULES } from '@/lib/service-modules'
import type { ServiceModuleKey, SubscriptionStatus } from '@/lib/service-modules'
import { ensureProductionAccountTables, getAdminAccounts } from '@/app/actions/admin-accounts'

export type ServicePlanRecord = {
  id: string
  name: string
  priceMonthly: number
  currency: string
  description: string | null
  includedModules: ServiceModuleKey[]
  customerLimit: number
  campaignLimit: number
  whatsappLimit: number
  userLimit: number
  status: string
}

export type ServicePlanInput = {
  id?: string
  name: string
  priceMonthly: number
  currency: string
  description?: string
  includedModules: ServiceModuleKey[]
  customerLimit: number
  campaignLimit: number
  whatsappLimit: number
  userLimit: number
  status: string
}

async function requireAdminAccess() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user || !(await canAccessAdminPanel(session.user.email))) {
    throw new Error('Unauthorized')
  }
}

function normalizePlanId(value: string) {
  return value.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48)
}

function parseModules(value: string): ServiceModuleKey[] {
  const valid = new Set(SERVICE_MODULES.map((module) => module.key))
  return value
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is ServiceModuleKey => valid.has(item as ServiceModuleKey))
}

function serializeModules(modules: ServiceModuleKey[]) {
  return Array.from(new Set(['dashboard', ...modules])).join(',')
}

function toRecord(row: typeof servicePlans.$inferSelect): ServicePlanRecord {
  return {
    id: row.id,
    name: row.name,
    priceMonthly: row.priceMonthly,
    currency: row.currency,
    description: row.description,
    includedModules: parseModules(row.includedModules),
    customerLimit: row.customerLimit,
    campaignLimit: row.campaignLimit,
    whatsappLimit: row.whatsappLimit,
    userLimit: row.userLimit,
    status: row.status,
  }
}

async function seedDefaultPlans() {
  const modules = SERVICE_MODULES.map((module) => module.key)
  const defaults: ServicePlanInput[] = [
    {
      id: 'Starter',
      name: 'Inicial',
      priceMonthly: 49,
      currency: 'USD',
      description: 'Para validar el programa con una sucursal.',
      includedModules: modules.filter((key) => !['reports', 'templates', 'industries'].includes(key)),
      customerLimit: 1000,
      campaignLimit: 5,
      whatsappLimit: 5000,
      userLimit: 3,
      status: 'active',
    },
    {
      id: 'Growth',
      name: 'Crecimiento',
      priceMonthly: 129,
      currency: 'USD',
      description: 'Para negocios que quieren crecer con marketing y wallet.',
      includedModules: modules.filter((key) => key !== 'industries'),
      customerLimit: 5000,
      campaignLimit: 20,
      whatsappLimit: 25000,
      userLimit: 8,
      status: 'active',
    },
    {
      id: 'Scale',
      name: 'Escala',
      priceMonthly: 249,
      currency: 'USD',
      description: 'Para operación multi-sucursal con reportes completos.',
      includedModules: modules,
      customerLimit: 15000,
      campaignLimit: 60,
      whatsappLimit: 100000,
      userLimit: 25,
      status: 'active',
    },
  ]

  for (const plan of defaults) {
    await db
      .insert(servicePlans)
      .values({
        id: plan.id!,
        name: plan.name,
        priceMonthly: plan.priceMonthly,
        currency: plan.currency,
        description: plan.description,
        includedModules: serializeModules(plan.includedModules),
        customerLimit: plan.customerLimit,
        campaignLimit: plan.campaignLimit,
        whatsappLimit: plan.whatsappLimit,
        userLimit: plan.userLimit,
        status: plan.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
  }
}

export async function getServicePlans() {
  await requireAdminAccess()
  await ensureProductionAccountTables()
  await seedDefaultPlans()

  const rows = await db.select().from(servicePlans).orderBy(servicePlans.createdAt)
  return rows.map(toRecord)
}

export async function upsertServicePlan(input: ServicePlanInput) {
  await requireAdminAccess()
  await ensureProductionAccountTables()

  const id = normalizePlanId(input.id || input.name)
  if (!id || !input.name.trim()) throw new Error('Plan inválido')

  const now = new Date()

  await db
    .insert(servicePlans)
    .values({
      id,
      name: input.name.trim(),
      priceMonthly: Math.max(0, Math.round(input.priceMonthly || 0)),
      currency: input.currency.trim() || 'USD',
      description: input.description?.trim() || null,
      includedModules: serializeModules(input.includedModules),
      customerLimit: Math.max(0, Math.round(input.customerLimit || 0)),
      campaignLimit: Math.max(0, Math.round(input.campaignLimit || 0)),
      whatsappLimit: Math.max(0, Math.round(input.whatsappLimit || 0)),
      userLimit: Math.max(0, Math.round(input.userLimit || 0)),
      status: input.status || 'active',
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: servicePlans.id,
      set: {
        name: input.name.trim(),
        priceMonthly: Math.max(0, Math.round(input.priceMonthly || 0)),
        currency: input.currency.trim() || 'USD',
        description: input.description?.trim() || null,
        includedModules: serializeModules(input.includedModules),
        customerLimit: Math.max(0, Math.round(input.customerLimit || 0)),
        campaignLimit: Math.max(0, Math.round(input.campaignLimit || 0)),
        whatsappLimit: Math.max(0, Math.round(input.whatsappLimit || 0)),
        userLimit: Math.max(0, Math.round(input.userLimit || 0)),
        status: input.status || 'active',
        updatedAt: now,
      },
    })

  revalidatePath('/admin/plans')
  return getServicePlans()
}

export async function deleteServicePlan(id: string) {
  await requireAdminAccess()
  await ensureProductionAccountTables()

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(businessAccounts)
    .where(eq(businessAccounts.plan, id))

  if (count > 0) {
    await db.update(servicePlans).set({ status: 'archived', updatedAt: new Date() }).where(eq(servicePlans.id, id))
  } else {
    await db.delete(servicePlans).where(eq(servicePlans.id, id))
  }

  revalidatePath('/admin/plans')
  return getServicePlans()
}

export async function updateAccountSubscription(input: {
  accountId: string
  planId: string
  status: SubscriptionStatus
}) {
  await requireAdminAccess()
  await ensureProductionAccountTables()

  const [plan] = await db.select().from(servicePlans).where(eq(servicePlans.id, input.planId)).limit(1)
  if (!plan) throw new Error('Plan no encontrado')

  await db
    .update(businessAccounts)
    .set({
      plan: plan.id,
      status: input.status,
      mrr: plan.priceMonthly,
      updatedAt: new Date(),
    })
    .where(eq(businessAccounts.id, input.accountId))

  const included = new Set(parseModules(plan.includedModules))

  for (const module of SERVICE_MODULES) {
    const enabled = module.key === 'dashboard' || included.has(module.key)
    await db.execute(sql`
      INSERT INTO "business_module_entitlements" (
        "id",
        "accountId",
        "moduleKey",
        "enabled",
        "createdAt",
        "updatedAt"
      )
      VALUES (${crypto.randomUUID()}, ${input.accountId}, ${module.key}, ${enabled}, now(), now())
      ON CONFLICT ("accountId", "moduleKey")
      DO UPDATE SET "enabled" = ${enabled}, "updatedAt" = now()
    `)
  }

  revalidatePath('/admin/plans')
  revalidatePath('/admin/accounts')
  revalidatePath('/admin/services')
  revalidatePath('/dashboard')
  return getAdminAccounts()
}
