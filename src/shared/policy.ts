export const ROLES = ['Developer', 'Operator', 'Admin'] as const
export type Role = (typeof ROLES)[number]
type Capability = 'view' | 'staging' | 'production' | 'approve' | 'rollback'

export function can(role: Role, capability: Capability) {
  return (
    capability === 'view' || capability === 'staging' || role !== 'Developer'
  )
}
