import { create } from 'zustand'
import type { Role } from '../shared/policy'

export const useIdentity = create<{
  role: Role
  setRole: (role: Role) => void
}>((set) => ({
  role: 'Developer',
  setRole: (role) => set({ role }),
}))
