import axiosInstance from '../axiosInstance'

async function login() {
  try {
    const resp = await axiosInstance.get('/users')

    console.log(resp.data)
  } catch (err: unknown) {
    throw new Error((err as Error).message)
  }
}

export default login
