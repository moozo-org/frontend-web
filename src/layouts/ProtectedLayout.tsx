import { Navigate, Outlet, useParams } from 'react-router'
import { getStored } from '../utils'

const ProtectedLayout = () => {
  const { event } = useParams()
  const token = getStored('token')

  if (!token) {
    return <Navigate to={`/event/${event}`} replace />
  }
  return <Outlet />
}

export default ProtectedLayout
