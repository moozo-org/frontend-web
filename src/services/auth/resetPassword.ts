import axiosInstance from "../axiosInstance"

// TODO: wait for the backend, POST /auth/reset-password
async function resetPassword(identifier: string, code: string, password: string) {
  await axiosInstance.post("/auth/reset-password", { identifier, code, password })
}

export default resetPassword
