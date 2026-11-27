import { Route } from "react-router"
import RequireAnonymous from "./guards/RequireAnonymous"
import {
  ForgotPassword,
  Home,
  Login,
  Register,
  RegisterProvider,
  ResetPassword,
  StyleGuide,
  VerifyAccount,
} from "../pages"

export const publicRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="style" element={<StyleGuide />} />

    <Route element={<RequireAnonymous />}>
      <Route path="login" element={<Login />} />
      <Route path="register">
        <Route index element={<Register />} />
        <Route path="provider" element={<RegisterProvider />} />
      </Route>
    </Route>
    <Route path="verify-account" element={<VerifyAccount />} />

    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
  </>
)
