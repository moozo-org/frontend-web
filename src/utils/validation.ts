const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE = /^\+?\d{8,15}$/

export const normalizeIdentifier = (value: string) => {
  const trimmed = value.trim()
  return EMAIL.test(trimmed) ? trimmed : trimmed.replace(/[\s.-]/g, '')
}

export const validateIdentifier = (identifier: string) => {
  if (!identifier) return 'Enter your email or phone number'
  if (!EMAIL.test(identifier) && !PHONE.test(identifier))
    return 'Enter a valid email or phone number'
}
