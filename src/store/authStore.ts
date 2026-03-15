import { create } from "zustand"
import { persist } from "zustand/middleware"
import { Role } from "@/constants/roles"

interface AuthUser {
  id: string
  username: string
  role: Role
}

interface AuthState {
  user: AuthUser | null
  role: Role | null

  setUser: (user: AuthUser) => void
  logout: () => void
  isAdmin: () => boolean
  isCustomer: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      role: null,

      setUser: (user) =>
        set({
          user,
          role: user.role,
        }),

      logout: () =>
        set({
          user: null,
          role: null,
        }),

      isAdmin: () => get().role === Role.ADMIN,
      isCustomer: () => get().role === Role.CUSTOMER,
    }),
    {
      name: "auth-storage",
    }
  )
)
