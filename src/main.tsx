import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import Photos from './pages/private/Photos'
import Program from './pages/private/Program'
import SeatingChart from './pages/private/SeatingChart'
import Table from './pages/private/Table'
import Home from './pages/public/Home'
import Verification from './pages/public/Verification'
import Welcome from './pages/public/Welcome'
import ProtectedLayout from './routes/ProtectedLayout'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />

        <Route path=":event">
          <Route index element={<Welcome />} />
          <Route path="verification" element={<Verification />} />

          <Route element={<ProtectedLayout />}>
            <Route path="photos" element={<Photos />} />
            <Route path="program" element={<Program />} />
            <Route path="seating" element={<SeatingChart />} />
            <Route path="table" element={<Table />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
