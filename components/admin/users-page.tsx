'use client'

import { useMemo, useState, useTransition } from 'react'
import { Plus, ShieldCheck, Trash2 } from 'lucide-react'
import {
  inviteAdminConsoleUser,
  removeAdminConsoleUser,
  updateAdminConsoleUserPermissions,
  updateAdminConsoleUserRole,
} from '@/app/actions/admin-users'
import type { AdminConsoleUser } from '@/app/actions/admin-users'
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
import { permissionOptions, rolePermissions } from '@/lib/admin-roles'
import type { AdminRole } from '@/lib/admin-roles'

export function AdminUsersPage({ initialUsers }: { initialUsers: AdminConsoleUser[] }) {
  const [users, setUsers] = useState<AdminConsoleUser[]>(initialUsers)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<AdminRole>('Operaciones')
  const [isPending, startTransition] = useTransition()

  const selectedPermissions = useMemo(() => rolePermissions[role], [role])

  const addUser = () => {
    if (!name.trim() || !email.trim()) return

    startTransition(async () => {
      const nextUsers = await inviteAdminConsoleUser({ name, email, role })
      setUsers(nextUsers)
      setName('')
      setEmail('')
      setRole('Operaciones')
    })
  }

  const updateRole = (userId: string, nextRole: AdminRole) => {
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

  return (
    <div className="product-shell">
      <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
        <Card className="premium-card p-5">
          <p className="product-kicker">Usuarios del administrador</p>
          <h2 className="mt-2 text-xl font-semibold tracking-normal">Invitar acceso al panel</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Registra usuarios del equipo SaaS y define el rol inicial con permisos base.
          </p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input value={name} onChange={(event) => setName(event.target.value)} className="mt-2" placeholder="Nombre del usuario" />
            </div>
            <div>
              <label className="text-sm font-medium">Correo</label>
              <Input value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" placeholder="correo@empresa.com" type="email" />
            </div>
            <div>
              <label className="text-sm font-medium">Rol</label>
              <Select value={role} onValueChange={(value) => setRole(value as AdminRole)}>
                <SelectTrigger className="mt-2 w-full bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(rolePermissions).map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="premium-card-muted p-4">
              <div className="mb-3 flex items-center gap-2">
                <ShieldCheck className="size-4 text-brand-teal" />
                <p className="text-sm font-semibold">Permisos iniciales</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedPermissions.map((permission) => (
                  <Badge key={permission} variant="outline" className="bg-background">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={addUser} className="w-full" disabled={isPending}>
              <Plus className="size-4" />
              Invitar usuario
            </Button>
          </div>
        </Card>

        <Card className="premium-card overflow-hidden">
          <div className="border-b border-border p-5">
            <p className="product-kicker">Roles y permisos</p>
            <h2 className="mt-2 text-xl font-semibold tracking-normal">Equipo con acceso administrativo</h2>
          </div>

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
                    <Select value={user.role} onValueChange={(value) => updateRole(user.id, value as AdminRole)} disabled={user.locked || isPending}>
                      <SelectTrigger className="w-36 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(rolePermissions).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
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
        </Card>
      </section>
    </div>
  )
}
