import axiosInstance from '../axiosInstance'

// TODO: wait for the backend, POST /auth/forgot-password
async function forgotPassword(identifier: string) {
  await axiosInstance.post('/auth/forgot-password', { identifier })
}

export default forgotPassword
