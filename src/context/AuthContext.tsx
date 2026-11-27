import { createContext } from "react"
import type { Role } from "../utils"

export type AuthStatus = "loading" | "authenticated" | "anonymous" | "error"

export type AuthContextType = {
  status: AuthStatus
  role: Role | null
  login: (identifier: string, password: string) => Promise<Role>
  verify: (identifier: string, code: string) => Promise<Role>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
