import { Route, Routes } from 'react-router'

import EventLayout from '../layouts/EventLayout'
import ProtectedLayout from '../layouts/ProtectedLayout'

import {
  ErrorPage,
  Home,
  Photos,
  Program,
  SeatingChart,
  StyleGuide,
  Table,
  Verification,
  Welcome,
} from '../pages'

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route index element={<Home />} />
    <Route path="style" element={<StyleGuide />} />

    <Route path="/event/:event" element={<EventLayout />}>
      <Route index element={<Welcome />} />
      <Route path="verification" element={<Verification />} />

      {/* Private */}
      <Route element={<ProtectedLayout />}>
        <Route path="photos" element={<Photos />} />
        <Route path="program" element={<Program />} />
        <Route path="seating" element={<SeatingChart />} />
        <Route path="table" element={<Table />} />
      </Route>
    </Route>

    <Route path="*" element={<ErrorPage />} />
  </Routes>
)

export default AppRoutes
