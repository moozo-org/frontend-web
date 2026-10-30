import { Navigate, Outlet, useParams } from 'react-router'
import { getStored } from '../utils'

// TODO: store `guest-token:<event>` once the event registration / verification flow exists
const RequireGuest = () => {
  const { event } = useParams()

  if (!getStored(`guest-token:${event}`)) return <Navigate to={`/event/${event}`} replace />

  return <Outlet />
}

export default RequireGuest
