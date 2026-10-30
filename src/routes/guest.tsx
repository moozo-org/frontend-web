import { Route } from 'react-router'
import RequireGuest from '../layouts/RequireGuest'
import { Photos, Placeholder, Program, SeatingChart, Table, Verification, Welcome } from '../pages'

export const guestRoutes = (
  <Route path="event/:event">
    <Route index element={<Welcome />} />
    <Route path="verification" element={<Verification />} />
    {/* TODO: confirm how the secure RSVP link carries its token */}
    <Route path="rsvp" element={<Placeholder title="RSVP" />} />

    <Route element={<RequireGuest />}>
      <Route path="photos" element={<Photos />} />
      <Route path="program" element={<Program />} />
      <Route path="seating" element={<SeatingChart />} />
      <Route path="table" element={<Table />} />
    </Route>
  </Route>
)
