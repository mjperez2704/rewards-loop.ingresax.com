'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { and, desc, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { campaigns, clients, whatsappMessages } from '@/lib/db/schema'

export type WhatsappSegment = 'all' | 'inactive' | 'vip' | 'new'

export type WhatsappMessageSummary = {
  totalAudience: number
  eligibleAudience: number
  sentMessages: number
  failedMessages: number
  queuedMessages: number
  integrationConfigured: boolean
}

export type WhatsappCampaignRecord = {
  id: string
  name: string
  status: string
  sent: number
  failed: number
  queued: number
  createdAt: Date
}

export type WhatsappCampaignInput = {
  segment: WhatsappSegment
  message: string
  campaignId?: string
}

const segmentLabels: Record<WhatsappSegment, string> = {
  all: 'Todos los clientes',
  inactive: 'Clientes inactivos',
  vip: 'Clientes VIP',
  new: 'Nuevos clientes',
}

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function ensureWhatsappMessageTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "whatsapp_messages" (
      "id" text PRIMARY KEY,
      "userId" text NOT NULL,
      "campaignId" text,
      "clientId" text,
      "recipient" text NOT NULL,
      "message" text NOT NULL,
      "status" text NOT NULL DEFAULT 'queued',
      "providerMessageId" text,
      "error" text,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)
}

function isWhatsappConfigured() {
  return Boolean(
    process.env.WHATSAPP_ACCESS_TOKEN?.trim()
    && process.env.WHATSAPP_PHONE_NUMBER_ID?.trim(),
  )
}

function normalizePhone(value: string | null) {
  const digits = value?.replace(/\D/g, '') ?? ''
  if (!digits) return null
  return digits.length === 10 ? `1${digits}` : digits
}

function applyTemplate(message: string, client: { name: string; loyaltyTier: string; totalPoints: number }) {
  return message
    .replaceAll('{{nombre}}', client.name)
    .replaceAll('{{nivel}}', client.loyaltyTier)
    .replaceAll('{{puntos}}', client.totalPoints.toLocaleString('es-MX'))
}

function segmentPredicate(segment: WhatsappSegment, client: { totalPoints: number; loyaltyTier: string; createdAt: Date }) {
  const ageDays = Math.floor((Date.now() - new Date(client.createdAt).getTime()) / 86400000)

  if (segment === 'vip') {
    return ['oro', 'gold', 'platino', 'platinum', 'diamante', 'diamond'].includes(client.loyaltyTier.toLowerCase())
      || client.totalPoints >= 500
  }
  if (segment === 'new') return ageDays <= 30
  if (segment === 'inactive') return ageDays >= 30
  return true
}

async function sendCloudApiText(to: string, body: string) {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim()
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp Cloud API no está configurado.')
  }

  const response = await fetch(`https://graph.facebook.com/v19.0/${phoneNumberId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { preview_url: false, body },
    }),
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload?.error?.message ?? 'No se pudo enviar el mensaje WhatsApp.')
  }

  return payload?.messages?.[0]?.id as string | undefined
}

async function getEligibleClients(userId: string, segment: WhatsappSegment) {
  const rows = await db
    .select()
    .from(clients)
    .where(and(eq(clients.userId, userId), eq(clients.status, 'active')))
    .orderBy(desc(clients.createdAt))

  return rows.filter((client) => normalizePhone(client.phone) && segmentPredicate(segment, client))
}

export async function getWhatsappData() {
  const userId = await getUserId()
  await ensureWhatsappMessageTable()

  const [clientRows, campaignRows, messageRows] = await Promise.all([
    db.select().from(clients).where(eq(clients.userId, userId)).orderBy(desc(clients.createdAt)),
    db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt)),
    db.select().from(whatsappMessages).where(eq(whatsappMessages.userId, userId)).orderBy(desc(whatsappMessages.createdAt)),
  ])

  const campaignsById = new Map(campaignRows.map((campaign) => [campaign.id, campaign]))
  const campaignRecords = campaignRows
    .map((campaign): WhatsappCampaignRecord & { total: number } => {
      const rows = messageRows.filter((message) => message.campaignId === campaign.id)

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        sent: rows.filter((message) => message.status === 'sent').length,
        failed: rows.filter((message) => message.status === 'failed').length,
        queued: rows.filter((message) => message.status === 'queued').length,
        createdAt: campaign.createdAt,
        total: rows.length,
      }
    })
    .filter((campaign) => campaign.total > 0)
    .map(({ total, ...campaign }) => campaign)

  const orphanMessages = messageRows.filter((message) => message.campaignId && !campaignsById.has(message.campaignId))

  return {
    summary: {
      totalAudience: clientRows.length,
      eligibleAudience: clientRows.filter((client) => Boolean(normalizePhone(client.phone))).length,
      sentMessages: messageRows.filter((message) => message.status === 'sent').length,
      failedMessages: messageRows.filter((message) => message.status === 'failed').length,
      queuedMessages: messageRows.filter((message) => message.status === 'queued').length,
      integrationConfigured: isWhatsappConfigured(),
    } satisfies WhatsappMessageSummary,
    campaigns: campaignRecords,
    recentMessages: messageRows.slice(0, 12),
    orphanMessages,
  }
}

export type WhatsappData = Awaited<ReturnType<typeof getWhatsappData>>

export async function sendWhatsappCampaign(input: WhatsappCampaignInput) {
  const userId = await getUserId()
  await ensureWhatsappMessageTable()

  const messageTemplate = input.message.trim()
  if (!messageTemplate) throw new Error('Escribe un mensaje para enviar.')
  if (!isWhatsappConfigured()) throw new Error('WhatsApp Cloud API no está configurado.')

  const recipients = await getEligibleClients(userId, input.segment)
  if (recipients.length === 0) throw new Error('No hay clientes con teléfono válido en este segmento.')

  let campaignId = input.campaignId
  if (!campaignId) {
    const now = new Date()
    campaignId = crypto.randomUUID()
    await db.insert(campaigns).values({
      id: campaignId,
      userId,
      name: `WhatsApp - ${segmentLabels[input.segment]}`,
      description: messageTemplate,
      startDate: now,
      endDate: now,
      pointsMultiplier: 1,
      status: 'active',
      createdAt: now,
      updatedAt: now,
    })
  }

  for (const client of recipients) {
    const phone = normalizePhone(client.phone)
    if (!phone) continue

    const body = applyTemplate(messageTemplate, client)
    const messageId = crypto.randomUUID()

    await db.insert(whatsappMessages).values({
      id: messageId,
      userId,
      campaignId,
      clientId: client.id,
      recipient: phone,
      message: body,
      status: 'queued',
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    try {
      const providerMessageId = await sendCloudApiText(phone, body)
      await db
        .update(whatsappMessages)
        .set({
          status: 'sent',
          providerMessageId: providerMessageId ?? null,
          error: null,
          updatedAt: new Date(),
        })
        .where(eq(whatsappMessages.id, messageId))
    } catch (caught) {
      await db
        .update(whatsappMessages)
        .set({
          status: 'failed',
          error: caught instanceof Error ? caught.message : 'Error desconocido',
          updatedAt: new Date(),
        })
        .where(eq(whatsappMessages.id, messageId))
    }
  }

  revalidatePath('/dashboard/whatsapp')
  revalidatePath('/dashboard/campaigns')
  return getWhatsappData()
}
