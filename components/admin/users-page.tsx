'use client'

import { useMemo, useState, useTransition } from 'react'
import { Plus, Save, ShieldCheck, Trash2 } from 'lucide-react'
import {
  deleteAdminRole,
  inviteAdminConsoleUser,
  removeAdminConsoleUser,
  updateAdminConsoleUserPermissions,
  updateAdminConsoleUserRole,
  upsertAdminRole,
} from '@/app/actions/admin-users'
import type { AdminConsoleUser, AdminRoleRecord } from '@/app/actions/admin-users'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { permissionOptions } from '@/lib/admin-roles'

export function AdminUsersPage({
  initialUsers,
  initialRoles,
}: {
  initialUsers: AdminConsoleUser[]
  initialRoles: AdminRoleRecord[]
}) {
  const [users, setUsers] = useState(initialUsers)
  const [roles, setRoles] = useState(initialRoles)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState(initialRoles.find((item) => item.name !== 'Super admin')?.name ?? initialRoles[0]?.name ?? 'Lectura')
  const [roleName, setRoleName] = useState('')
  const [roleDescription, setRoleDescription] = useState('')
  const [rolePermissionsDraft, setRolePermissionsDraft] = useState<string[]>(['Cuentas'])
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedPermissions = useMemo(
    () => roles.find((item) => item.name === role)?.permissions ?? [],
    [role, roles],
  )

  const resetRoleForm = () => {
    setEditingRoleId(null)
    setRoleName('')
    setRoleDescription('')
    setRolePermissionsDraft(['Cuentas'])
  }

  const addUser = () => {
    if (!name.trim() || !email.trim()) return

    startTransition(async () => {
      const nextUsers = await inviteAdminConsoleUser({ name, email, role })
      setUsers(nextUsers)
      setName('')
      setEmail('')
      setRole(roles.find((item) => item.name !== 'Super admin')?.name ?? roles[0]?.name ?? 'Lectura')
    })
  }

  const updateRole = (userId: string, nextRole: string) => {
    startTransition(async () => {
      setUsers(await updateAdminConsoleUserRole(userId, nextRole))
    })
  }

  const togglePermission = (userId: string, permission: string, checked: boolean) => {
    const user = users.find((item) => item.id === userId)
    if (!user) return

    const nextPermissions = checked
      ? Array.from(new Set([...user.permissions, permission]))
      : user.permissions.filter((item) => item !== permission)

    startTransition(async () => {
      setUsers(await updateAdminConsoleUserPermissions(userId, nextPermissions))
    })
  }

  const removeUser = (userId: string) => {
    startTransition(async () => {
      setUsers(await removeAdminConsoleUser(userId))
    })
  }

  const editRole = (roleRecord: AdminRoleRecord) => {
    setEditingRoleId(roleRecord.id)
    setRoleName(roleRecord.name)
    setRoleDescription(roleRecord.description ?? '')
    setRolePermissionsDraft(roleRecord.permissions)
  }

  const toggleRolePermission = (permission: string, checked: boolean) => {
    setRolePermissionsDraft((current) =>
      checked
        ? Array.from(new Set([...current, permission]))
        : current.filter((item) => item !== permission),
    )
  }

  const saveRole = () => {
    if (!roleName.trim()) return

    startTransition(async () => {
      setRoles(await upsertAdminRole({
        id: editingRoleId ?? undefined,
        name: roleName,
        description: roleDescription,
        permissions: rolePermissionsDraft,
      }))
      resetRoleForm()
    })
  }

  const removeRole = (roleId: string) => {
    startTransition(async () => {
      setRoles(await deleteAdminRole(roleId))
    })
  }

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">Roles</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">CRUD de roles y permisos</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Define perfiles reutilizables para el equipo administrador y controla sus permisos.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del rol</label>
              <Input value={roleName} onChange={(event) => setRoleName(event.target.value)} className="mt-2" placeholder="Ej. Éxito del cliente" />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Input value={roleDescription} onChange={(event) => setRoleDescription(event.target.value)} className="mt-2" placeholder="Qué puede administrar este rol" />
            </div>

            <div className="premium-card-muted p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-teal" />
                <p className="text-sm font-semibold">Permisos del rol</p>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {permissionOptions.map((permission) => (
                  <label key={permission} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                      checked={rolePermissionsDraft.includes(permission)}
                      onCheckedChange={(checked) => toggleRolePermission(permission, checked === true)}
                    />
                    {permission}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={saveRole} className="flex-1" disabled={isPending}>
                <Save className="size-4" />
                {editingRoleId ? 'Guardar rol' : 'Crear rol'}
              </Button>
              {editingRoleId && (
                <Button variant="outline" onClick={resetRoleForm} disabled={isPending}>
                  Cancelar
                </Button>
              )}
            </div>

            <div className="space-y-2 border-t border-border pt-4">
              {roles.map((roleRecord) => (
                <div key={roleRecord.id} className="rounded-lg border border-border/75 bg-background p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{roleRecord.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{roleRecord.description || 'Sin descripción'}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => editRole(roleRecord)}>
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeRole(roleRecord.id)}
                        disabled={roleRecord.locked || isPending}
                        aria-label={`Eliminar rol ${roleRecord.name}`}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {roleRecord.permissions.map((permission) => (
                      <Badge key={permission} variant="outline" className="bg-background">{permission}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="premium-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="product-kicker">Usuarios y accesos</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">CRUD de usuarios administradores</h2>
            <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_1fr_180px_auto]">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Nombre del usuario" />
              <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="correo@empresa.com" type="email" />
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((option) => (
                    <SelectItem key={option.id} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={addUser} disabled={isPending}>
                <Plus className="size-4" />
                Invitar
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedPermissions.map((permission) => (
                <Badge key={permission} variant="outline" className="bg-background">{permission}</Badge>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Permisos</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select value={user.role} onValueChange={(value) => updateRole(user.id, value)} disabled={user.locked || isPending}>
                        <SelectTrigger className="w-44 bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((option) => (
                            <SelectItem key={option.id} value={option.name}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={user.status === 'Activo' ? 'status-success' : 'status-brand'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex max-w-md flex-wrap gap-3">
                        {permissionOptions.map((permission) => (
                          <label key={permission} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Checkbox
                              checked={user.permissions.includes(permission)}
                              disabled={user.locked || isPending}
                              onCheckedChange={(checked) => togglePermission(user.id, permission, checked === true)}
                            />
                            {permission}
                          </label>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeUser(user.id)}
                        aria-label={`Eliminar ${user.name}`}
                        disabled={user.locked || isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>
    </div>
  )
}
