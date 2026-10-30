import axiosInstance from '../axiosInstance'
import { setStored } from '../../utils'

interface RegisterPayload {
  firstName: string
  lastName: string
  identifier: string
  password: string
}

interface RegisterResponse {
  token: string
}

async function register(payload: RegisterPayload) {
  const { data } = await axiosInstance.post<RegisterResponse>('/auth/register', payload)

  setStored('token', data.token)

  return data
}

export default register
