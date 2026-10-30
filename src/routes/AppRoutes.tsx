import { Route, Routes } from 'react-router'
import { ErrorPage } from '../pages'

import { accountRoutes } from './account'
import { adminRoutes } from './admin'
import { guestRoutes } from './guest'
import { organizerRoutes } from './organizer'
import { providerRoutes } from './provider'
import { publicRoutes } from './public'

const AppRoutes = () => (
  <Routes>
    {publicRoutes}
    {guestRoutes}
    {accountRoutes}
    {providerRoutes}
    {organizerRoutes}
    {adminRoutes}

    <Route path="*" element={<ErrorPage />} />
  </Routes>
)

export default AppRoutes
