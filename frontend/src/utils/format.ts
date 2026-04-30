export function padDigits(value: number, digits: number): string {
  const abs = Math.abs(Math.min(value, 999))
  const str = String(abs).padStart(digits, '0')
  return value < 0 ? `-${str.slice(1)}` : str
}

export function formatTime(seconds: number): string {
  return padDigits(seconds, 3)
}
