export const permissionOptions = ['Cuentas', 'Microservicios', 'Planes', 'Usuarios', 'Auditoria'] as const

export const rolePermissions = {
  'Super admin': ['Cuentas', 'Microservicios', 'Planes', 'Usuarios', 'Auditoria'],
  Operaciones: ['Cuentas', 'Microservicios', 'Auditoria'],
  Soporte: ['Cuentas', 'Microservicios'],
  Facturacion: ['Cuentas', 'Planes'],
  Lectura: ['Cuentas'],
} as const

export type AdminRole = keyof typeof rolePermissions

export function getPermissionsForRole(role: AdminRole) {
  return [...rolePermissions[role]]
}

export function serializePermissions(permissions: string[]) {
  return permissions.join(',')
}

export function parsePermissions(value: string) {
  return value.split(',').map((permission) => permission.trim()).filter(Boolean)
}
