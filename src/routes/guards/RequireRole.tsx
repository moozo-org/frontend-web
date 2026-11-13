import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../../hooks/useAuth"
import { ErrorPage } from "../../pages"
import { homeFor, type Role } from "../../utils"
import { PageLoader } from "../../molecules"

// Without `role`, any signed-in user can enter
const RequireRole = ({ role }: { role?: Role }) => {
  const location = useLocation()
  const { status, role: current } = useAuth()

  if (status === "loading") return <PageLoader />
  if (status === "error") return <ErrorPage />

  if (status === "anonymous") {
    const from = location.pathname + location.search + location.hash
    return <Navigate to="/login" state={{ from }} replace />
  }

  if (role && current !== role) return <Navigate to={homeFor(current)} replace />

  return <Outlet />
}

export default RequireRole
