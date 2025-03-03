export function dateFormat(date: string | Date): string {
  if (date instanceof Date) {
    return date.toLocaleDateString()
  }
  return new Date(date).toLocaleDateString()
}
