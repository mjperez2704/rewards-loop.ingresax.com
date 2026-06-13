import crypto from 'node:crypto'
import { NextResponse } from 'next/server'
import { sql } from 'drizzle-orm'
import { db } from '@/lib/db'

export const runtime = 'nodejs'

function verifySignature(body: string, signature: string | null) {
  const appSecret = process.env.WHATSAPP_APP_SECRET?.trim()
  if (!appSecret) return process.env.NODE_ENV !== 'production'
  if (!signature?.startsWith('sha256=')) return false

  const expected = `sha256=${crypto
    .createHmac('sha256', appSecret)
    .update(body)
    .digest('hex')}`

  const left = Buffer.from(signature)
  const right = Buffer.from(expected)
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

async function ensureWhatsappEventsTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "whatsapp_events" (
      "id" text PRIMARY KEY,
      "eventType" text NOT NULL,
      "sender" text,
      "payload" text NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now()
    )
  `)
}

function extractSender(payload: unknown) {
  if (!payload || typeof payload !== 'object') return null
  const entry = (payload as { entry?: Array<{ changes?: Array<{ value?: { messages?: Array<{ from?: string }> } }> }> }).entry
  return entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ?? null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const mode = url.searchParams.get('hub.mode')
  const token = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')
  const expectedToken = process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN?.trim()

  if (!expectedToken) {
    return NextResponse.json(
      { error: 'WHATSAPP_WEBHOOK_VERIFY_TOKEN is not configured.' },
      { status: 503 },
    )
  }

  if (mode === 'subscribe' && token === expectedToken && challenge) {
    return new Response(challenge, {
      status: 200,
      headers: { 'content-type': 'text/plain' },
    })
  }

  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('x-hub-signature-256')

  if (!verifySignature(body, signature)) {
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 })
  }

  let payload: unknown
  try {
    payload = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  await ensureWhatsappEventsTable()

  await db.execute(sql`
    INSERT INTO "whatsapp_events" ("id", "eventType", "sender", "payload", "createdAt")
    VALUES (
      ${crypto.randomUUID()},
      ${'webhook.received'},
      ${extractSender(payload)},
      ${JSON.stringify(payload)},
      now()
    )
  `)

  return NextResponse.json({ received: true })
}
