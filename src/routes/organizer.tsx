import { Navigate, Route } from 'react-router'
import RequireRole from '../layouts/RequireRole'
import { Placeholder } from '../pages'

export const organizerRoutes = (
  <Route path="organizer" element={<RequireRole role="ORGANIZER" />}>
    <Route index element={<Navigate to="events" replace />} />

    <Route path="events">
      <Route index element={<Placeholder title="My events" />} />
      <Route path="new" element={<Placeholder title="New event" />} />

      <Route path=":eventId">
        <Route index element={<Placeholder title="Event overview" />} />

        <Route path="guests" element={<Placeholder title="Guests" />} />
        <Route path="rsvp" element={<Placeholder title="RSVP settings" />} />

        <Route path="seating" element={<Placeholder title="Seating plan" />} />
        <Route path="program" element={<Placeholder title="Program" />} />
        <Route path="tasks" element={<Placeholder title="Tasks" />} />
        <Route path="photos" element={<Placeholder title="Photos" />} />

        <Route path="providers" element={<Placeholder title="Providers" />} />
        <Route path="messages">
          <Route index element={<Placeholder title="Messages" />} />
          <Route path=":conversationId" element={<Placeholder title="Conversation" />} />
        </Route>

        <Route path="settings" element={<Placeholder title="Event settings" />} />
      </Route>
    </Route>
  </Route>
)
