export const now = performance.now.bind(performance)

export const formatTime = (seconds: number, decimals?: number) => {
  const m = Math.floor(seconds / 60)
  const s = seconds - m * 60
  let formattedSeconds: string
  if (decimals !== undefined) {
    const factor = Math.pow(10, decimals)
    const truncated = Math.floor(s * factor) / factor
    formattedSeconds = truncated.toFixed(decimals)
  } else {
    formattedSeconds = Math.floor(s).toString()
  }
  const mm = m.toString().padStart(2, '0')
  const ssPadLength = decimals ? 3 + decimals : 2
  const ss = formattedSeconds.padStart(ssPadLength, '0')
  return `${mm}:${ss}`
}
