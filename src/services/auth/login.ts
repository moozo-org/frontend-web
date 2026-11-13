import axiosInstance from "../axiosInstance"
import { setStored, type Role } from "../../utils"

interface LoginResponse {
  token: string
  role: Role
}

async function login(identifier: string, password: string) {
  const { data } = await axiosInstance.post<LoginResponse>("/auth/login", { identifier, password })

  setStored("token", data.token)

  return data
}

export default login
