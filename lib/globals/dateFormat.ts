export function dateFormat(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString()
}
