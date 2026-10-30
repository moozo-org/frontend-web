import { Route } from 'react-router'
import RequireRole from '../layouts/RequireRole'
import { Placeholder } from '../pages'

export const accountRoutes = (
  <Route element={<RequireRole />}>
    <Route path="profile">
      <Route index element={<Placeholder title="Profile" />} />
      <Route path="payment-methods" element={<Placeholder title="Payment methods" />} />
    </Route>

    <Route path="settings" element={<Placeholder title="Settings" />} />
    <Route path="notifications" element={<Placeholder title="Notifications" />} />

    <Route path="payments">
      <Route index element={<Placeholder title="Payment history" />} />
      <Route path=":paymentId" element={<Placeholder title="Payment detail" />} />
    </Route>
  </Route>
)
