import { Navigate, Route } from 'react-router'
import RequireRole from '../layouts/RequireRole'
import { Placeholder } from '../pages'

export const providerRoutes = (
  <Route path="provider" element={<RequireRole role="PROVIDER" />}>
    <Route index element={<Navigate to="services" replace />} />

    <Route path="services">
      <Route index element={<Placeholder title="My services" />} />
      <Route path="new" element={<Placeholder title="New service" />} />
      <Route path=":serviceId" element={<Placeholder title="Service" />} />
    </Route>

    <Route path="requests" element={<Placeholder title="Service requests" />} />

    <Route path="messages">
      <Route index element={<Placeholder title="Messages" />} />
      <Route path=":conversationId" element={<Placeholder title="Conversation" />} />
    </Route>

    <Route path="calendar" element={<Placeholder title="Calendar" />} />
  </Route>
)
