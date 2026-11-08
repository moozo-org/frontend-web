import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { homeFor } from '../../utils'
import { PageLoader } from '../../molecules'

// Login and register pages: a signed-in user goes to the page they came for, or their home.
// This also handles the redirect right after a successful login.
const RequireAnonymous = () => {
  const { state } = useLocation()
  const { status, role } = useAuth()

  if (status === 'loading') return <PageLoader />
  if (status === 'authenticated') return <Navigate to={state?.from ?? homeFor(role)} replace />

  return <Outlet />
}

export default RequireAnonymous
