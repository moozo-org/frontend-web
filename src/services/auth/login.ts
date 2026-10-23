import axiosInstance from '../axiosInstance'

interface LoginResponse {
  token: string
}

async function login(identifier: string, password: string) {
  const { data } = await axiosInstance.post<LoginResponse>('/auth/login', { identifier, password })

  localStorage.setItem('token', data.token)

  return data
}

export default login
