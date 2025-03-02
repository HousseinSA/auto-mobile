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

    const body = await request.json()
    const { success, message } = await updateService(serviceId, body)

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

    const { success, message } = await deleteService(serviceId)

    if (!success) {
      return Response.json({ success: false, error: message }, { status: 400 })
    }

    return Response.json({ success, message })
  } catch (error) {
    return Response.json(
      { success: false, error: "Erreur lors de la suppression du service" },
      { status: 500 }
    )
  }
}
