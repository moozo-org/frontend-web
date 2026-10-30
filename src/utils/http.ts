import { isAxiosError } from 'axios'

export const getErrorStatus = (err: unknown) =>
  isAxiosError(err) ? err.response?.status : undefined
