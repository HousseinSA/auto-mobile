export const  shortenFileName = (
  filename: string,
  maxLength: number = 20
): string => {
  if (!filename || filename.length <= maxLength) return filename

  const extension = filename.slice(filename.lastIndexOf("."))
  const nameWithoutExt = filename.slice(0, filename.lastIndexOf("."))

  const truncatedLength = maxLength - extension.length - 3
  const truncatedName = nameWithoutExt.slice(0, truncatedLength)

  return `${truncatedName}...${extension}`
}
