import { Route, Routes } from 'react-router'

import EventLayout from '../layouts/EventLayout'
import ProtectedLayout from '../layouts/ProtectedLayout'

import ErrorPage from '../pages/public/Error/Error'
import Home from '../pages/public/Home/Home'
import StyleGuide from '../pages/public/StyleGuide/StyleGuide'
import Verification from '../pages/public/Verification/Verification'
import Welcome from '../pages/public/Welcome/Welcome'

import Photos from '../pages/private/Photos/Photos'
import Program from '../pages/private/Program/Program'
import SeatingChart from '../pages/private/SeatingChart/SeatingChart'
import Table from '../pages/private/Table/Table'

const AppRoutes = () => (
  <Routes>
    {/* Public */}
    <Route index element={<Home />} />
    <Route path="style" element={<StyleGuide />} />

    <Route path=":event" element={<EventLayout />}>
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
