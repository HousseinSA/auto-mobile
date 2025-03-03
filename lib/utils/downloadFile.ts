export async function downloadServiceFile(serviceId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/services/${serviceId}/download`)
    
    if (!response.ok) {
      throw new Error('Download failed')
    }

    const blob = await response.blob()
    const filename = response.headers
      .get('content-disposition')
      ?.split('filename=')[1]
      ?.replace(/"/g, '') || 'download.bin'

    // Create a link element and trigger download
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    return true
  } catch (error) {
    console.error('Download error:', error)
    return false
  }
}