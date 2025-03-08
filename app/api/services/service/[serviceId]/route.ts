/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server"
import { deleteService, updateService } from "@/lib/mongodb/mongodb"

export async function PUT(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.pathname.split("/").pop()
    if (!serviceId) {
      return Response.json(
        { success: false, error: "ID du service requis" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const serviceDataJson = formData.get("serviceData") as string
    const serviceData = JSON.parse(serviceDataJson)
    const file = formData.get("stockFile") as File | null

    let fileBuffer: Buffer | undefined
    if (file) {
      const arrayBuffer = await file.arrayBuffer()
      fileBuffer = Buffer.from(arrayBuffer)
    }

    const { success, message } = await updateService(
      serviceId,
      serviceData,
      fileBuffer
    )

    if (!success) {
      return Response.json({ success: false, error: message }, { status: 400 })
    }

    return Response.json({ success, message })
  } catch (error) {
    return Response.json(
      { success: false, error: "Erreur lors de la mise à jour du service" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.pathname.split("/").pop()
    if (!serviceId) {
      return Response.json(
        { success: false, error: "ID du service requis" },
        { status: 400 }
      )
    }

    const result = await deleteService(serviceId)

    if (!result.success) {
      return Response.json(
        { success: false, error: result.message },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error("Delete API error:", error)
    return Response.json(
      { 
        success: false, 
        error: "Erreur lors de la suppression du service",
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
