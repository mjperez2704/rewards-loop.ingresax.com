import { and, inArray, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { adminConsoleUsers } from '@/lib/db/schema'

const FALLBACK_MASTER_ADMIN_EMAILS = ['admin@ingresax.com']
const ACTIVE_ADMIN_STATUSES = ['Activo', 'Invitado']

function parseEmailList(value?: string) {
  return value
    ?.split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean) ?? []
}

export function getMasterAdminEmails() {
  const configuredEmails = [
    ...parseEmailList(process.env.MASTER_ADMIN_EMAILS),
    ...parseEmailList(process.env.ADMIN_EMAILS),
  ]

  return configuredEmails.length > 0 ? configuredEmails : FALLBACK_MASTER_ADMIN_EMAILS
}

export function isMasterAdminEmail(email?: string | null) {
  if (!email) return false
  return getMasterAdminEmails().includes(email.toLowerCase())
}

export async function ensureAdminConsoleUsersTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "admin_console_users" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL,
      "email" text NOT NULL UNIQUE,
      "role" text NOT NULL,
      "status" text NOT NULL DEFAULT 'Invitado',
      "permissions" text NOT NULL,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)
}

export async function canAccessAdminPanel(email?: string | null) {
  if (!email) return false
  if (isMasterAdminEmail(email)) return true

  try {
    await ensureAdminConsoleUsersTable()

    const [adminUser] = await db
      .select({ id: adminConsoleUsers.id })
      .from(adminConsoleUsers)
      .where(
        and(
          sql`lower(${adminConsoleUsers.email}) = ${email.toLowerCase()}`,
          inArray(adminConsoleUsers.status, ACTIVE_ADMIN_STATUSES),
        ),
      )
      .limit(1)

    return Boolean(adminUser)
  } catch {
    return false
  }
}

export async function getAdminAccessEmails() {
  try {
    await ensureAdminConsoleUsersTable()

    const rows = await db
      .select({ email: adminConsoleUsers.email })
      .from(adminConsoleUsers)
      .where(inArray(adminConsoleUsers.status, ACTIVE_ADMIN_STATUSES))

    return Array.from(new Set([...getMasterAdminEmails(), ...rows.map((row) => row.email.toLowerCase())]))
  } catch {
    return getMasterAdminEmails()
  }
}
