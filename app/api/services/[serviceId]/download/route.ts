import { NextRequest, NextResponse } from "next/server"
import { getServiceFile } from "@/lib/mongodb/services/serviceQueries"

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const serviceId = params.serviceId
    const file = await getServiceFile(serviceId)

    // Create headers for file download
    const headers = new Headers()
    headers.set("Content-Disposition", `attachment; filename="${file.name}"`)
    headers.set("Content-Type", "application/octet-stream")

    return new NextResponse(file.data, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Download error:", error)
    return NextResponse.json(
      { error: "Failed to download file" },
      { status: 500 }
    )
  }
}