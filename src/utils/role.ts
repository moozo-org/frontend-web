// TODO: Wait for type with codegen
export type Role = 'ORGANIZER' | 'PROVIDER' | 'ADMIN'

export const homeFor = (role: Role | null) => {
  if (role === 'ORGANIZER') return '/organizer'
  if (role === 'PROVIDER') return '/provider'
  if (role === 'ADMIN') return '/admin'
  return '/login'
}
