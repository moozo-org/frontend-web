import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router'
import getMe from '../services/users/me'
import { getStored, homeFor, type Role } from '../utils'

const RequireRole = ({ role }: { role?: Role }) => {
  const location = useLocation()
  const hasToken = !!getStored('token')
  const [current, setCurrent] = useState<Role | null | undefined>(undefined)

  useEffect(() => {
    if (!role || !hasToken) return
    getMe()
      .then((me) => setCurrent(me.role))
      .catch(() => setCurrent(null))
  }, [role, hasToken])

  if (!hasToken) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!role) return <Outlet />

  if (current === undefined) return null
  if (current !== role) return <Navigate to={homeFor(current)} replace />

  return <Outlet />
}

export default RequireRole
