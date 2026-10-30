import { Route } from 'react-router'
import RequireRole from '../layouts/RequireRole'
import { Placeholder } from '../pages'

export const adminRoutes = (
  <Route path="admin" element={<RequireRole role="ADMIN" />}>
    <Route index element={<Placeholder title="Dashboard" />} />

    <Route path="providers">
      <Route index element={<Placeholder title="Providers" />} />
      <Route path=":providerId" element={<Placeholder title="Provider" />} />
    </Route>

    <Route path="services">
      <Route index element={<Placeholder title="Services" />} />
      <Route path=":serviceId" element={<Placeholder title="Service" />} />
    </Route>

    <Route path="reviews">
      <Route index element={<Placeholder title="Reviews" />} />
      <Route path="reported" element={<Placeholder title="Reported reviews" />} />
      <Route path=":reviewId" element={<Placeholder title="Review" />} />
    </Route>

    <Route path="users/:userId" element={<Placeholder title="User sanctions" />} />
  </Route>
)
