export const getStored = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const setStored = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value)
  } catch {
    // ignore: the value just won't persist
  }
}
