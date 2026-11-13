import axiosInstance from "../axiosInstance"
import { setStored, type Role } from "../../utils"

interface VerifyResponse {
  token: string
  role: Role
}

// TODO: wait for the backend, POST /auth/verify
async function verify(identifier: string, code: string) {
  const { data } = await axiosInstance.post<VerifyResponse>("/auth/verify", { identifier, code })

  setStored("token", data.token)

  return data
}

export default verify
