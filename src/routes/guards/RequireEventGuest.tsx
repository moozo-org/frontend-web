import { Navigate, Outlet, useParams } from 'react-router'
import { getStored } from '../../utils'

// TODO: store `guest-token:<eventId>` once the event registration / verification flow exists
const RequireEventGuest = () => {
  const { eventId } = useParams()

  if (!getStored(`guest-token:${eventId}`)) return <Navigate to={`/event/${eventId}`} replace />

  return <Outlet />
}

export default RequireEventGuest
