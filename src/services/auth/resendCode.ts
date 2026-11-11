import axiosInstance from '../axiosInstance'

// TODO: wait for the backend, POST /auth/verify/resend
async function resendCode(identifier: string) {
  await axiosInstance.post('/auth/verify/resend', { identifier })
}

export default resendCode
