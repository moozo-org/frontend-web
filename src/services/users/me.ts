import axiosInstance from '../axiosInstance'
import type { Role } from '../../utils'

interface Me {
  role: Role
}

// TODO: wait for the backend, GET /users/me
async function getMe() {
  const { data } = await axiosInstance.get<Me>('/users/me')

  return data
}

export default getMe
