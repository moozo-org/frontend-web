import axiosInstance from '../axiosInstance'

// TODO: wait for the backend, PATCH /users/me/password
async function changePassword(currentPassword: string, newPassword: string) {
  await axiosInstance.patch('/users/me/password', { currentPassword, newPassword })
}

export default changePassword
