import axiosInstance from '../axiosInstance'

interface RegisterProviderPayload {
  firstName: string
  lastName: string
  companyName: string
  identifier: string
  password: string
  documents: File[]
}

// TODO: wait for the backend, POST /auth/register/provider (multipart, fields and documents to confirm)
async function registerProvider({ documents, ...fields }: RegisterProviderPayload) {
  const body = new FormData()

  Object.entries(fields).forEach(([key, value]) => body.append(key, value))
  documents.forEach((file) => body.append('documents', file))

  await axiosInstance.post('/auth/register/provider', body)
}

export default registerProvider
