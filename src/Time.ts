export const now = performance.now.bind(performance)

export const formatTime = (seconds: number, decimals?: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds - m * 60
  const rounded = decimals !== undefined ? s.toFixed(decimals) : Math.floor(s).toString()
  const mm = m < 10 ? `0${m}` : m.toString()
  // add -1 to account for lack of decimal point
  const ss = rounded.length < 3 + (decimals ?? -1) ? `0${rounded}` : rounded
  return `${mm}:${ss}`
}
