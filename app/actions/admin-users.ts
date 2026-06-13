'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { adminConsoleUsers } from '@/lib/db/schema'
import {
  canAccessAdminPanel,
  ensureAdminConsoleUsersTable,
  getMasterAdminEmails,
  isMasterAdminEmail,
} from '@/lib/admin-access'
import {
  getPermissionsForRole,
  parsePermissions,
  rolePermissions,
  serializePermissions,
} from '@/lib/admin-roles'
import type { AdminRole } from '@/lib/admin-roles'

export type AdminConsoleUser = {
  id: string
  name: string
  email: string
  role: AdminRole
  status: string
  permissions: string[]
  locked?: boolean
}

function isAdminRole(value: string): value is AdminRole {
  return value in rolePermissions
}

async function requireAdminAccess() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session?.user || !(await canAccessAdminPanel(session.user.email))) {
    throw new Error('Unauthorized')
  }

  return session.user
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function toConsoleUser(row: typeof adminConsoleUsers.$inferSelect): AdminConsoleUser {
  const role = isAdminRole(row.role) ? row.role : 'Lectura'

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role,
    status: row.status,
    permissions: parsePermissions(row.permissions),
  }
}

export async function getAdminConsoleUsers(): Promise<AdminConsoleUser[]> {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()

  const rows = await db
    .select()
    .from(adminConsoleUsers)
    .orderBy(adminConsoleUsers.createdAt)

  const databaseUsers = rows.map(toConsoleUser)
  const configuredUsers = getMasterAdminEmails().map((email) => {
    const existing = databaseUsers.find((user) => user.email.toLowerCase() === email)

    return existing
      ? {
          ...existing,
          role: 'Super admin' as const,
          status: 'Activo',
          permissions: getPermissionsForRole('Super admin'),
          locked: true,
        }
      : {
      id: `env-${email}`,
      name: 'Administrador principal',
      email,
      role: 'Super admin' as const,
      status: 'Activo',
      permissions: getPermissionsForRole('Super admin'),
      locked: true,
    }
  })

  return [
    ...configuredUsers,
    ...databaseUsers.filter((user) => !isMasterAdminEmail(user.email)),
  ]
}

export async function inviteAdminConsoleUser(input: { name: string; email: string; role: AdminRole }) {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()

  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const role = input.role

  if (!name || !email || !isAdminRole(role)) {
    throw new Error('Invalid admin user')
  }

  const now = new Date()
  const permissions = serializePermissions(getPermissionsForRole(role))

  await db
    .insert(adminConsoleUsers)
    .values({
      id: crypto.randomUUID(),
      name,
      email,
      role,
      status: 'Invitado',
      permissions,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminConsoleUsers.email,
      set: {
        name,
        role,
        status: 'Invitado',
        permissions,
        updatedAt: now,
      },
    })

  revalidatePath('/admin/users')
  return getAdminConsoleUsers()
}

export async function updateAdminConsoleUserRole(id: string, role: AdminRole) {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()

  if (id.startsWith('env-') || !isAdminRole(role)) {
    return getAdminConsoleUsers()
  }

  await db
    .update(adminConsoleUsers)
    .set({
      role,
      permissions: serializePermissions(getPermissionsForRole(role)),
      updatedAt: new Date(),
    })
    .where(eq(adminConsoleUsers.id, id))

  revalidatePath('/admin/users')
  return getAdminConsoleUsers()
}

export async function updateAdminConsoleUserPermissions(id: string, permissions: string[]) {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()

  if (id.startsWith('env-')) {
    return getAdminConsoleUsers()
  }

  const nextPermissions = permissions.filter((permission) => permission.length > 0)

  await db
    .update(adminConsoleUsers)
    .set({
      permissions: serializePermissions(nextPermissions),
      updatedAt: new Date(),
    })
    .where(eq(adminConsoleUsers.id, id))

  revalidatePath('/admin/users')
  return getAdminConsoleUsers()
}

export async function removeAdminConsoleUser(id: string) {
  const currentUser = await requireAdminAccess()
  await ensureAdminConsoleUsersTable()

  if (id.startsWith('env-')) {
    return getAdminConsoleUsers()
  }

  await db
    .delete(adminConsoleUsers)
    .where(
      and(
        eq(adminConsoleUsers.id, id),
        sql`lower(${adminConsoleUsers.email}) <> ${currentUser.email.toLowerCase()}`,
      ),
    )

  revalidatePath('/admin/users')
  return getAdminConsoleUsers()
}
