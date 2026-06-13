'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { and, eq, sql } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { adminConsoleUsers, adminRoles } from '@/lib/db/schema'
import {
  canAccessAdminPanel,
  ensureAdminConsoleUsersTable,
  getMasterAdminEmails,
  isMasterAdminEmail,
} from '@/lib/admin-access'
import { getPermissionsForRole, parsePermissions, rolePermissions, serializePermissions } from '@/lib/admin-roles'

export type AdminConsoleUser = {
  id: string
  name: string
  email: string
  role: string
  status: string
  permissions: string[]
  locked?: boolean
}

export type AdminRoleRecord = {
  id: string
  name: string
  description: string | null
  permissions: string[]
  locked: boolean
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
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    status: row.status,
    permissions: parsePermissions(row.permissions),
  }
}

async function ensureAdminRolesTable() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "admin_roles" (
      "id" text PRIMARY KEY,
      "name" text NOT NULL UNIQUE,
      "description" text,
      "permissions" text NOT NULL,
      "locked" boolean NOT NULL DEFAULT false,
      "createdAt" timestamp NOT NULL DEFAULT now(),
      "updatedAt" timestamp NOT NULL DEFAULT now()
    )
  `)
}

async function seedAdminRoles() {
  await ensureAdminRolesTable()

  for (const [name, permissions] of Object.entries(rolePermissions)) {
    await db
      .insert(adminRoles)
      .values({
        id: name,
        name,
        description: name === 'Super admin' ? 'Acceso completo a la administración SaaS.' : null,
        permissions: serializePermissions([...permissions]),
        locked: name === 'Super admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
  }
}

function toRoleRecord(row: typeof adminRoles.$inferSelect): AdminRoleRecord {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: parsePermissions(row.permissions),
    locked: row.locked,
  }
}

async function getPermissionsForRoleName(role: string) {
  await seedAdminRoles()

  const [row] = await db.select().from(adminRoles).where(eq(adminRoles.name, role)).limit(1)
  if (row) return parsePermissions(row.permissions)
  if (role in rolePermissions) return getPermissionsForRole(role as keyof typeof rolePermissions)
  return []
}

export async function getAdminConsoleUsers(): Promise<AdminConsoleUser[]> {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()
  await seedAdminRoles()

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
          role: 'Super admin',
          status: 'Activo',
          permissions: getPermissionsForRole('Super admin'),
          locked: true,
        }
      : {
      id: `env-${email}`,
      name: 'Administrador principal',
      email,
      role: 'Super admin',
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

export async function getAdminRoleRecords(): Promise<AdminRoleRecord[]> {
  await requireAdminAccess()
  await seedAdminRoles()

  const rows = await db.select().from(adminRoles).orderBy(adminRoles.createdAt)
  return rows.map(toRoleRecord)
}

export async function upsertAdminRole(input: { id?: string; name: string; description?: string; permissions: string[] }) {
  await requireAdminAccess()
  await seedAdminRoles()

  const name = input.name.trim()
  if (!name) throw new Error('Role name is required')

  const existingId = input.id || name
  const now = new Date()

  await db
    .insert(adminRoles)
    .values({
      id: existingId,
      name,
      description: input.description?.trim() || null,
      permissions: serializePermissions(input.permissions),
      locked: false,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: adminRoles.id,
      set: {
        name,
        description: input.description?.trim() || null,
        permissions: serializePermissions(input.permissions),
        updatedAt: now,
      },
    })

  revalidatePath('/admin/users')
  return getAdminRoleRecords()
}

export async function deleteAdminRole(id: string) {
  await requireAdminAccess()
  await seedAdminRoles()

  const [role] = await db.select().from(adminRoles).where(eq(adminRoles.id, id)).limit(1)
  if (!role || role.locked) return getAdminRoleRecords()

  await db.delete(adminRoles).where(eq(adminRoles.id, id))
  await db
    .update(adminConsoleUsers)
    .set({
      role: 'Lectura',
      permissions: serializePermissions(await getPermissionsForRoleName('Lectura')),
      updatedAt: new Date(),
    })
    .where(eq(adminConsoleUsers.role, role.name))

  revalidatePath('/admin/users')
  return getAdminRoleRecords()
}

export async function inviteAdminConsoleUser(input: { name: string; email: string; role: string }) {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()
  await seedAdminRoles()

  const name = input.name.trim()
  const email = normalizeEmail(input.email)
  const role = input.role

  if (!name || !email) {
    throw new Error('Invalid admin user')
  }

  const now = new Date()
  const permissions = serializePermissions(await getPermissionsForRoleName(role))

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

export async function updateAdminConsoleUserRole(id: string, role: string) {
  await requireAdminAccess()
  await ensureAdminConsoleUsersTable()
  await seedAdminRoles()

  if (id.startsWith('env-')) {
    return getAdminConsoleUsers()
  }

  await db
    .update(adminConsoleUsers)
    .set({
      role,
      permissions: serializePermissions(await getPermissionsForRoleName(role)),
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
