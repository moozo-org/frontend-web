import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'

import Photos from './pages/private/Photos'
import Program from './pages/private/Program'
import SeatingChart from './pages/private/SeatingChart'
import Table from './pages/private/Table'
import ErrorPage from './pages/public/Error'
import Home from './pages/public/Home'
import Verification from './pages/public/Verification'
import Welcome from './pages/public/Welcome'
import { ThemeProvider } from './providers/ThemeProvider'
import ProtectedLayout from './layouts/ProtectedLayout'

import './index.css'
import EventLayout from './layouts/EventLayout'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />

          <Route path=":event" element={<EventLayout />}>
            <Route index element={<Welcome />} />
            <Route path="verification" element={<Verification />} />

            <Route element={<ProtectedLayout />}>
              <Route path="photos" element={<Photos />} />
              <Route path="program" element={<Program />} />
              <Route path="seating" element={<SeatingChart />} />
              <Route path="table" element={<Table />} />
            </Route>
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
