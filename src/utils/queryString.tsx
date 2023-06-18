const urlParams = new URLSearchParams(window.location.search)

export const queryString = (key: string) => {
  return urlParams.get(key)
}
