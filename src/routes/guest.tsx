import { Route } from 'react-router'
import EventLayout from '../layouts/EventLayout'
import RequireEventGuest from './guards/RequireEventGuest'
import { Photos, Placeholder, Program, SeatingChart, Table, Verification, Welcome } from '../pages'

export const guestRoutes = (
  <Route path="event/:eventId" element={<EventLayout />}>
    <Route index element={<Welcome />} />
    <Route path="verification" element={<Verification />} />
    {/* TODO: confirm how the secure RSVP link carries its token */}
    <Route path="rsvp" element={<Placeholder title="RSVP" />} />

    <Route element={<RequireEventGuest />}>
      <Route path="photos" element={<Photos />} />
      <Route path="program" element={<Program />} />
      <Route path="seating" element={<SeatingChart />} />
      <Route path="table" element={<Table />} />
    </Route>
  </Route>
)
