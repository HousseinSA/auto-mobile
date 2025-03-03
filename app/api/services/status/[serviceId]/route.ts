/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest } from "next/server"
import { updateServiceStatus } from "@/lib/mongodb/services/serviceModification"

export async function PUT(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.pathname.split("/").pop()
    if (!serviceId) {
      return Response.json(
        { success: false, error: "ID du service requis" },
        { status: 400 }
      )
    }

    const { status } = await request.json()
    if (!status) {
      return Response.json(
        { success: false, error: "Status requis" },
        { status: 400 }
      )
    }

    const { success, message } = await updateServiceStatus(serviceId, status)
    if (!success) {
      return Response.json({ success: false, error: message }, { status: 400 })
    }

    return Response.json({ success, message })
  } catch (error) {
    return Response.json(
      { success: false, error: "Erreur lors de la mise à jour du status" },
      { status: 500 }
    )
  }
}