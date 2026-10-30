import { Navigate, Outlet, useParams } from 'react-router'

const ProtectedLayout = () => {
  const { event } = useParams()
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to={`/event/${event}`} replace />
  }
  return <Outlet />
}

export default ProtectedLayout
