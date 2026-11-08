import { Route } from 'react-router'
import RequireAnonymous from './guards/RequireAnonymous'
import { Home, Login, Placeholder, Register, StyleGuide } from '../pages'

export const publicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="style" element={<StyleGuide />} />

    <Route element={<RequireAnonymous />}>
      <Route path="login" element={<Login />} />
      <Route path="register">
        <Route index element={<Register />} />
        {/* Spec 01: separate page, reached from a "Become a provider" link, with documents */}
        <Route path="provider" element={<Placeholder title="Become a provider" />} />
      </Route>
    </Route>
    <Route path="verify-account" element={<Placeholder title="Verify your account" />} />

    <Route path="forgot-password" element={<Placeholder title="Forgot password" />} />
    <Route path="reset-password" element={<Placeholder title="Reset password" />} />
  </>
)
