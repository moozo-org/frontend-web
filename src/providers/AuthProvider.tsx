import { useEffect, useState } from 'react'
import { AuthContext, type AuthStatus } from '../context/AuthContext'
import loginRequest from '../services/auth/login'
import getMe from '../services/users/me'
import { AUTH_EXPIRED, getErrorStatus, getStored, removeStored, type Role } from '../utils'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>(() =>
    getStored('token') ? 'loading' : 'anonymous'
  )
  const [role, setRole] = useState<Role | null>(null)

  // Restore the session once, so guards and pages share a single /users/me call
  useEffect(() => {
    if (!getStored('token')) return

    let cancelled = false

    getMe()
      .then((me) => {
        if (cancelled) return
        setRole(me.role)
        setStatus('authenticated')
      })
      .catch((err) => {
        if (cancelled) return
        const code = getErrorStatus(err)

        // 401: expired token, 403: account pending or banned. Anything else is a real failure
        if (code === 401 || code === 403) {
          removeStored('token')
          setStatus('anonymous')
        } else {
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const onExpired = () => {
      setRole(null)
      setStatus('anonymous')
    }

    window.addEventListener(AUTH_EXPIRED, onExpired)
    return () => window.removeEventListener(AUTH_EXPIRED, onExpired)
  }, [])

  const login = async (identifier: string, password: string) => {
    const data = await loginRequest(identifier, password)

    setRole(data.role)
    setStatus('authenticated')

    return data.role
  }

  const logout = () => {
    removeStored('token')
    setRole(null)
    setStatus('anonymous')
  }

  return (
    <AuthContext.Provider value={{ status, role, login, logout }}>{children}</AuthContext.Provider>
  )
}
