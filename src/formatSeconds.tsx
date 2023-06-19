// format seconds as mm:ss
export const formatSeconds = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  const paddedSeconds = remainder < 10 ? `0${remainder}` : remainder
  return `${minutes}:${paddedSeconds}`
}
