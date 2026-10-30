import { Route } from 'react-router'
import { Home, Login, Placeholder, Register, StyleGuide } from '../pages'

export const publicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="style" element={<StyleGuide />} />

    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="verify-account" element={<Placeholder title="Verify your account" />} />

    <Route path="forgot-password" element={<Placeholder title="Forgot password" />} />
    <Route path="reset-password" element={<Placeholder title="Reset password" />} />
  </>
)
